<script>
  import EventPill from "./EventPill.svelte";
  import server from "../server.js";
  import { gql } from "apollo-boost";

  let events = [];

  server.client
    .request({
      query: gql`
        query {
          getEvents(length: 10) {
            desc
            date
            context
          }
        }
      `
    })
    .subscribe(res => {
      events = res.data.getEvents;
      server.wsClient
        .request({
          query: gql`
            subscription {
              newEvent {
                desc
                date
                context
              }
            }
          `
        })
        .subscribe(event => (events = events.concat([event.data.newEvent])));
    });
</script>

{#each events as event}
  <EventPill {...event} />
{/each}
