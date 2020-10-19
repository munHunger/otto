<script>
  export let name, commit, status, port;
</script>

<style>
  .item {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(4, 1fr);
    margin-bottom: 5px;
  }

  .item:last-of-type {
    margin-bottom: 0px;
  }

  .property {
    grid-column: span 1;
  }

  .property.commit {
    color: #888;
  }

  .status.running {
    color: rgb(43, 145, 158);
  }
  .status.starting_up {
    color: rgb(158, 43, 81);
    animation: starting-up 2s ease-in-out 0s infinite alternate-reverse;
  }
  @keyframes starting-up {
    0% {
      color: rgb(158, 43, 81);
    }
    100% {
      color: rgb(79, 67, 100);
    }
  }
  .status.disabled {
    color: rgba(88, 88, 88, 0.534);
  }
</style>

<div class="item">
  <div class="property name">{name}</div>
  <div class="property commit">{commit}</div>
  <div class="property status {status.toLowerCase()}">{status}</div>
  <div class="property port">{port}</div>
</div>
