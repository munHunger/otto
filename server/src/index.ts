import "reflect-metadata";
import { Server } from "./server";
import { Config, ConfigScanner, Repo } from "./config";
import { ServiceConfig } from "./services/service";

let configuration = Config.load();
configuration.scan();

// console.log(ServiceConfig.fromFile("/tmp/flashcards/otto.yml"));
const { monitoring } = require("otto-lib");

monitoring.server(4000).then((monitoring: any) => {
  new Server().startBackend(5001).then(monitoring.setUp());
});
