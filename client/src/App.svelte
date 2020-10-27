<script>
  import MediaQuery from "./MediaQuery.svelte";
  import ServiceList from "./service/ServiceList.svelte";
  import Events from "./events/Events.svelte";
</script>

<style>
  :global(body) {
    background-color: rgb(37, 40, 59);
    color: #ccc;
    padding: 50px;
    font-family: "Roboto", sans-serif;
  }
  .card {
    background-color: rgb(45, 50, 70);
    padding: 20px;
    border-radius: 5px;
    margin: 10px;
  }
  .otto {
    text-align: center;
    font-weight: 600;
    font-size: 3rem;
    letter-spacing: 0.5rem;
    margin-top: 3rem;
  }
  .card .title {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
  .col {
    float: left;
  }
  .col.left {
    width: 25%;
  }
  .col.right {
    width: 75%;
    transition: all 0.25s ease-in-out;
  }
  @media (max-width: 800px) {
    .col.right {
      width: 100%;
    }
    :global(body) {
      background-color: rgb(37, 40, 59);
      color: #ccc;
      padding: 25px;
      font-family: "Roboto", sans-serif;
    }
  }
</style>

<MediaQuery query="(max-width: 800px)" let:matches>
  {#if !matches}
    <div class="col left">
      <div class="otto">Otto</div>
      <div class="events">
        <Events />
      </div>
    </div>
  {/if}
</MediaQuery>

<div class="col right">
  <div class="card">
    <div class="title">Services</div>
    <ServiceList />
  </div>
</div>
