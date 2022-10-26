<script>
  import { createEventDispatcher } from "svelte";
  import "../css/global.css";
  let main;
  export let headerHeight = 64;
  export let footerHeight = 64;
  $: if (main) {
    main.style.setProperty("--header-height", headerHeight + "px");
    main.style.setProperty("--footer-height", footerHeight + "px");
  }
</script>

<div class="main-layout">
  <div class="slotHeader">
    <div class="container d-flex flex-column align-items-end">
      <div class="d-flex align-items-center w-100 justify-content-between header py-3">
        <a href="/">Home</a>
        <a href="/hotels/add" class="mr-3">Create Hotel </a>
      </div>
    </div>
  </div>
  <main>
    <slot />
  </main>
</div>
