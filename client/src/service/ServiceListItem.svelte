<script>
  export let name, commit, status, port, headers;
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
    color: rgba(255, 255, 255, 0.25);
  }

  .status.running {
    color: rgb(43, 145, 158);
  }
  .status.down {
    color: rgb(158, 43, 81);
    animation: down 2s ease-in-out 0s infinite alternate-reverse;
  }
  @keyframes down {
    0% {
      color: rgb(158, 43, 81);
    }
    100% {
      color: rgba(255, 255, 255, 0.25);
    }
  }
  .status.disabled {
    color: rgba(255, 255, 255, 0.25);
  }

  .header {
    color: rgba(255, 255, 255, 0.25);
    font-weight: 500;
    letter-spacing: 0.1rem;
    margin-bottom: 0.5rem;
  }
</style>

<div class="item">
  {#if !headers}
    <div class="property name">{name}</div>
    <div class="property commit">{commit}</div>
    <div class="property status {status.toLowerCase()}">{status}</div>
    <div class="property port">{port}</div>
  {:else}
    <div class="header">name</div>
    <div class="header">hash</div>
    <div class="header">status</div>
    <div class="header">port</div>
  {/if}
</div>
