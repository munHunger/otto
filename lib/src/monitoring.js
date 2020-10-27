const express = require("express");

let server = (port) =>
  new Promise((resolve, reject) => {
    const app = express();
    let monitoringPoints = {
      status: "STARTING_UP",
    };
    app.get("/", (req, res) => {
      res.send(JSON.stringify(monitoringPoints));
    });

    app.get("/:point", (req, res) => {
      res.send(JSON.stringify(monitoringPoints[req.params.point]));
    });

    app.get("/status", (req, res) => {
      res.send(JSON.stringify({ status }));
    });
    app.listen(port, () => {
      console.log(`monitoring listening at http://localhost:${port}`);
    });

    resolve({
      setUp: () => (monitoringPoints.status = "UP"),
      addPoint: (key, point) => (monitoringPoints[key] = point),
    });
  });

module.exports = { server };
