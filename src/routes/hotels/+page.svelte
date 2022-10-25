<script>
   import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";
    import { setClient, query, mutation } from "svelte-apollo";	
    const client = new ApolloClient({
        uri: "http://localhost:5000/graphql",
        cache: new InMemoryCache()
    });
    setClient(client);

    
	// // Query

	// const HOTELS = gql`
	// 	query Hotels($search: String) {
	// 		hotels(search: $search) {
    //             address
	// 			name
	// 		}
	// 	}
	// `;

	// let search ="asdf";
	// const hotels = query(HOTELS, {
	// 	variables: { search }
	// });

	// function reload() {
	// 	hotels.refetch();
	// }

	// $: hotels.refetch({ search });

  </script>
  
  <style>
          button {
            background: #ff3e00;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 2px;
          }
  </style>
    
<!-- <label>Search <input type="search" bind:value="{search}" /></label>

<button on:click="{reload}">Reload</button> -->
  {#if hotels}
    {#if $hotels.loading}
      Loading...
    {:else if $hotels.error}
      Error: {$hotels.error.message}
    {:else}
      <ul>
        {#each $hotels.data.hotels as hotel}
          <li>
            <a href="">{hotel.name}</a>
          </li>
        {/each}
      </ul>
    {/if}
  {/if}