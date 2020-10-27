import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "apollo-link-ws";

export const wsClient = new SubscriptionClient("ws://localhost:5001/graphql", {
  reconnect: true,
});

export const client = new WebSocketLink(wsClient);

export default { wsClient, client };
