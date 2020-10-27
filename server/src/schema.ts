import "graphql-import-node";
import { PubSub } from "graphql-subscriptions";
import { buildSchema, PubSubEngine } from "type-graphql";
import { Container } from "typedi";
import { EventResolver } from "./events/event";
import { ServiceResolver } from "./services/service";

Container.set("pubsub", new PubSub() as PubSubEngine);
const schema = buildSchema({
  resolvers: [EventResolver, ServiceResolver],
  container: Container,
  pubSub: Container.get<PubSubEngine>("pubsub"),
});
export default schema;
