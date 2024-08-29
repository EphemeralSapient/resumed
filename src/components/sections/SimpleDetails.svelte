<script>
    import SimpleDetail from '../items/SimpleDetail.svelte';
    export let details;
  </script>
  <style>
    .ok {
      /* box-shadow: 0 5px 7px rgba(0, 0, 0, 0.2); */
      padding: 15px;
    }
  </style>
  <div class="ok">
    {#each details as { title, subtitle, icon, url, link, description }}
      <SimpleDetail {title} {subtitle} {icon} {url} {link} {description} />
    {/each}
  </div>
  