import fs from "fs";
import { Octokit } from "@octokit/rest";
import { deleteFolderRecursive } from "./util";
import simpleGit, { SimpleGitOptions } from "simple-git";
import Container, { Service } from "typedi";
import { PubSubEngine } from "type-graphql";
import { Event } from "./events/event";
import { ServiceConfig, ManagedService } from "./services/service";
const octokit = new Octokit();

export class Repo {
  name: string;
  hash: string;
  enabled: boolean;
  hasOttoFile: boolean;
  config: ServiceConfig;

  constructor(repo: Repo) {
    Object.assign(this, repo);
  }
}

export class Config {
  static url: string = "/home/munhunger/.config/otto.json";
  repos: Repo[];

  constructor(config: Config) {
    Object.assign(this, config);
  }

  static load() {
    return new Config(JSON.parse(fs.readFileSync(Config.url, "utf-8")));
  }

  save() {
    return fs.promises.writeFile(
      Config.url,
      JSON.stringify(this, null, 2),
      "utf-8"
    );
  }

  scan() {
    ConfigScanner.scan(this).then(() =>
      setTimeout(() => this.scan(), 10 * 60 * 1000)
    );
  }
}

export class ConfigScanner {
  static async getUnscannedRepos(configuration: Config) {
    let unscanned = [] as any;
    const data = await octokit.repos.listForUser({
      username: "munhunger",
    });
    const repos = data.data;
    await repos
      .filter((repo: any) => {
        let savedRepo = configuration.repos.find((r) => r.name === repo.name);
        return (savedRepo && savedRepo.enabled) || !savedRepo;
      })
      .map((repo_1: any) =>
        octokit.repos
          .listBranches({
            owner: "munhunger",
            repo: repo_1.name,
          })
          .then((data_1) => data_1.data)
          .then((branches) => {
            let hash = branches.find((branch) => branch.name === "master")
              .commit.sha;
            if (
              (
                configuration.repos.find(
                  (r_1: any) => r_1.name === repo_1.name
                ) || {}
              ).hash !== hash
            ) {
              let savedRepo = configuration.repos.find(
                (r) => r.name === repo_1.name
              );
              let newRepo =
                savedRepo ||
                new Repo({
                  name: repo_1.name,
                  hash,
                  enabled: true,
                  hasOttoFile: undefined,
                  config: undefined,
                });
              newRepo.hash = hash;
              unscanned.push(newRepo);
              if (!savedRepo) {
                Event.publish(
                  `registered new service ${newRepo.name}`,
                  "config scanner"
                );
                configuration.repos.push(newRepo);
              }
            }
          })
      )
      .reduce(
        (acc: Promise<any>, val: Promise<any>) =>
          acc
            .then(() => new Promise((resolve) => setTimeout(resolve, 5000)))
            .then(() => val),
        Promise.resolve()
      );
    return unscanned;
  }
  static async scan(config: Config) {
    await ConfigScanner.getUnscannedRepos(config).then((repos) => {
      if (repos.length === 0) console.log("no repos to scan");
      repos.forEach((repo: Repo) => {
        deleteFolderRecursive(`/opt/otto/${repo.name}`);
        const options: SimpleGitOptions = {
          baseDir: "/opt/otto",
          binary: "git",
          maxConcurrentProcesses: 6,
        };
        Event.publish(`scanning repo ${repo.name}`, "config scanner");
        const git = simpleGit(options);
        git.clone(`https://github.com/munhunger/${repo.name}.git`).then(() => {
          repo.hasOttoFile = fs.existsSync(
            `${options.baseDir}/${repo.name}/otto.yml`
          );
          if (repo.hasOttoFile) {
            repo.config = ServiceConfig.fromFile(
              `${options.baseDir}/${repo.name}/otto.yml`
            );
            let service = new ManagedService(repo.config, repo.hash);
            service.start();
          }
          config.save();
        });
      });
    });
  }
}
