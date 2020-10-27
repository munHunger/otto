import express from "express";
import { ApolloServer } from "apollo-server-express";
import http from "http";
import schema from "./schema";

export class Server {
  /**
   * Start the backend graphql server on the given port
   * @param {Number} port the port to start on
   */
  async startBackend(port: number) {
    const app = express();

    app.use(
      "",
      express.static(__dirname + "/../node_modules/otto-client/public")
    );

    return schema.then((schema) => {
      const server = new ApolloServer({
        schema,
      });

      server.applyMiddleware({
        app,
      });

      const httpServer = http.createServer(app);
      server.installSubscriptionHandlers(httpServer);

      httpServer.listen(port, () => {
        console.log(
          `Otto ready at http://localhost:${port}${server.graphqlPath}`
        );
        console.log(
          `Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
        );
      });
    });
  }
}
