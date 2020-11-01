import "reflect-metadata";
import { Server } from "./server";
import { Config, ConfigScanner, Repo } from "./config";
import { ServiceConfig } from "./services/service";
import express from "express";

let configuration = Config.load();
configuration.scan();

// console.log(ServiceConfig.fromFile("/tmp/flashcards/otto.yml"));
const { monitoring } = require("otto-lib");

monitoring.server(4000).then((monitoring: any) => {
  new Server().startBackend(5001).then(monitoring.setUp());

  let proxy = express();

  proxy.get("/", (req, res) => {
    res.send("hello world");
  });

  proxy.listen(80, () => console.log("proxy listening on port 80"));
});
