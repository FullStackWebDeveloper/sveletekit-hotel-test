<script>
  import { createEventDispatcher } from "svelte";
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
      <div class="d-flex align-items-center justify-content-end header py-3">
        <a href="./pages/createHotel.html" class="mr-3">Create Hotel </a>
        <a href="./pages/register.html">Register </a>
      </div>
      <input
        type="input"
        placeholder="Search"
        class="form-control search-input"
      />
    </div>
  </div>
  <main>
    <slot />
  </main>
</div>
