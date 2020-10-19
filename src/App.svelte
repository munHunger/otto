<script>
  import ServiceListItem from "./service/ServiceListItem.svelte";
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
  .col {
    float: left;
  }
  .col.left {
    width: 25%;
  }
  .col.right {
    width: 75%;
  }
</style>

<div class="col left">
  <div class="title">Otto</div>
  <div class="events">
	  
  </div>
</div>
<div class="col right">
  <div class="card">
    <ServiceListItem name="boldrei" commit="bb00122b" status="RUNNING" port="5000"/>
    <ServiceListItem name="datapi" commit="a1df46ed" status="STARTING_UP" port="5002" />
    <ServiceListItem name="soft sync" commit="cd84af6e" status="RUNNING" port="4001" />
    <ServiceListItem name="blitzbauen" commit="8cc43d9f" status="DISABLED" port="3040" />
  </div>
  <div class="card">this is another card</div>
</div>
