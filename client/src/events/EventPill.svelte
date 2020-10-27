<script>
  export let date, desc, context;
</script>

<style>
  .wrapper {
    background-color: rgba(0, 0, 0, 0.25);
    margin: 15px 5px 0px 5px;
    padding: 15px;
  }
  .context {
    letter-spacing: 0.2rem;
    color: rgba(255, 255, 255, 0.25);
  }
  .date {
    color: rgba(255, 255, 255, 0.5);
    font-size: small;
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
</style>

<div class="wrapper">
  <div class="left col" />
  <div class="right col">
    <div class="event">{desc}</div>
    <div class="context">{context}</div>
    <div class="date">{date}</div>
  </div>
  <div style="clear: both" />
</div>
