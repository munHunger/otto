import { SubscriptionClient } from "subscriptions-transport-ws";
import { WebSocketLink } from "apollo-link-ws";

console.log(window.location);

export const wsClient = new SubscriptionClient(
  `ws://${window.location.hostname}:5001/graphql`,
  {
    reconnect: true,
  }
);

export const client = new WebSocketLink(wsClient);

export default { wsClient, client };
