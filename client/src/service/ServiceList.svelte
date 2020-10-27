<script>
  import ServiceListItem from "./ServiceListItem.svelte";
  import server from "../server.js";
  import { gql } from "apollo-boost";

  let services = [];

  server.client
    .request({
      query: gql`
        query {
          getServices {
            config {
              name
              ports
            }
            status
            hash
          }
        }
      `
    })
    .subscribe(res => {
      services = res.data.getServices;
      server.wsClient
        .request({
          query: gql`
            subscription {
              updatedService {
                config {
                  name
                  ports
                }
                status
                hash
              }
            }
          `
        })
        .subscribe(update => {
          let existing = services.find(
            service =>
              service.config.name === update.data.updatedService.config.name
          );
          if (!existing)
            services = services.concat([update.data.updatedService]);
          else {
            existing.status = update.data.updatedService.status;
            services = services;
          }
        });
    });
</script>

<div class="list">
  <ServiceListItem headers={true} />
  {#each services as service}
    <ServiceListItem
      name={service.config.name}
      commit={service.hash.substring(0, 8)}
      status={service.status}
      port={(service.config.ports || []).join(', ')} />
  {/each}
</div>
