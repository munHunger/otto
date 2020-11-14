import yaml from "js-yaml";
import fs from "fs";
import * as exec from "child_process";
import Container, { Service } from "typedi";
import {
  Field,
  ObjectType,
  PubSubEngine,
  Query,
  Root,
  Subscription,
} from "type-graphql";
import { Event } from "../events/event";
import { Config } from "../config";
import http from "http";
import request from "request";
export class MonitoringConfig {
  port: number;
}
export class ScriptsConfig {
  start: string;
  build: string;
  test: string;
}
@ObjectType()
export class ServiceConfig {
  @Field({ nullable: true })
  path: string;
  @Field()
  name: string;
  @Field(() => [Number], { nullable: true })
  ports: number[];
  monitoring: MonitoringConfig;
  scripts: ScriptsConfig;

  static fromFile(url: string) {
    let conf = new ServiceConfig(
      yaml.safeLoad(fs.readFileSync(url, "utf8")) as ServiceConfig
    );
    conf.path = url.substr(0, url.length - "otto.yml".length);
    return conf;
  }

  constructor(serviceConfig: ServiceConfig) {
    Object.assign(this, serviceConfig);
  }
}

@ObjectType("Service")
export class ManagedService {
  @Field()
  config: ServiceConfig;
  @Field({ nullable: true })
  status: string;
  @Field()
  hash: string;

  constructor(serviceConfig: ServiceConfig, hash: string) {
    this.config = serviceConfig;
    this.hash = hash;
  }

  start() {
    Event.publish(`building service`, this.config.name);
    let options = { cwd: `/opt/otto/${this.config.name}` };
    console.log(`building ${this.config.name}`);
    exec.exec(this.config.scripts.build || "", options, () => {
      console.log(`starting service ${this.config.name}`);
      exec.exec(this.config.scripts.start, options);
    });
  }

  resolveStatus() {
    return new Promise<ManagedService>((resolve, reject) =>
      request.get(
        "http://localhost:" + this.config.monitoring.port,
        {},
        (err, res, body) => {
          let oldStatus = this.status;
          if (err) {
            this.status = "DOWN";
            if (oldStatus !== this.status)
              Container.get<PubSubEngine>("pubsub").publish(
                "SERVICE_UPDATE",
                this
              );
            resolve(this);
          } else {
            this.status = JSON.parse(body).status;
            if (oldStatus !== this.status)
              Container.get<PubSubEngine>("pubsub").publish(
                "SERVICE_UPDATE",
                this
              );
            resolve(this);
          }
        }
      )
    );
  }
}

class ServiceManager {
  static run() {
    Promise.all(
      Config.load()
        .repos.filter((repo) => repo.enabled)
        .map((repo) =>
          new ManagedService(repo.config, repo.hash).resolveStatus()
        )
    ).then((services) => {
      services
        .filter((service) => service.status != "UP")
        .forEach((service) => service.start());
      setTimeout(ServiceManager.run, 5000);
    });
  }
}
ServiceManager.run();

@Service()
export class ServiceResolver {
  @Subscription(() => ManagedService, {
    topics: "SERVICE_UPDATE",
  })
  updatedService(@Root() update: ManagedService): ManagedService {
    return update;
  }

  @Query(() => [ManagedService])
  async getServices(): Promise<ManagedService[]> {
    return Promise.all(
      Config.load()
        .repos.filter((repo) => repo.enabled)
        .map((repo) =>
          new ManagedService(repo.config, repo.hash).resolveStatus()
        )
    );
  }
}
