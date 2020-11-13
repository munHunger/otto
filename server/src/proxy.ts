import express from "express";
import path from "path";
const http = require("http");

export class Proxy {
  constructor() {
    let proxy = express();
    proxy.use(
      express.static(path.join(__dirname, "build"), { dotfiles: "allow" })
    );

    proxy.use((req, res, next) => {
      res.setHeader("Connection", "close");
      next();
    });

    proxy.get("*", (req, res) => {
      const options = {
        // host to forward to
        host: "home.munhunger.com",
        // port to forward to
        port: 5003,
        // path to forward to
        path: req.originalUrl,
        // request method
        method: "GET",
        // headers to send
        headers: { ...req.headers, Connection: "close" },
      };
      if (req.hostname.split(".")[0] === "otto") {
        options.port = 5001;
      }
      if (req.hostname.split(".")[0] === "flashcards") {
        options.port = 5003;
      }
      console.log(req.originalUrl);
      http
        .request(options, (pres: any) => {
          // set encoding
          pres.setEncoding("utf8");

          // set http status code based on proxied response
          res.status(pres.statusCode);

          // wait for data
          pres.on("data", (chunk: any) => {
            res.write(chunk);
          });

          pres.on("close", () => {
            console.log("close" + req.originalUrl);
            // closed, let's end client request as well
            res.end();
          });

          pres.on("end", () => {
            console.log("end" + req.originalUrl);
            // finished, let's finish client request as well
            res.end();
          });
        })
        .on("error", (e: any) => {
          // we got an error
          console.log(e.message);
          try {
            // attempt to set error message and http status
            res.status(500);
            res.write(e.message);
          } catch (e) {
            // ignore
          }
          res.end();
        })
        .end();

      //   creq.end();
    });

    //proxy.listen(80, () => console.log("proxy listening on port 80"));

    let greenlock = require("greenlock-express").init({
      packageRoot: "/home/munhunger/develop/otto/server",
      configDir: "/home/munhunger/develop/otto/server/config",

      // contact for security and critical bug notices
      maintainerEmail: "marcusmunger@gmail.com",

      // whether or not to run at cloudscale
      cluster: false,
    });

    console.log(greenlock);

    greenlock
      // Serves on 80 and 443
      // Get's SSL certificates magically!
      .serve(proxy);
  }
}
