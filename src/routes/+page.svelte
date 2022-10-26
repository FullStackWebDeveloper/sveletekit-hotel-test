<script>
  import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";
  import { setClient, query, mutation } from "svelte-apollo";
  import { PUBLIC_SERVER_URL } from '$env/static/public'
  import "../css/homepage.css";
  import Layout from "./Layout.svelte";

  const client = new ApolloClient({
    uri: PUBLIC_SERVER_URL + "/graphql",
    cache: new InMemoryCache(),
  });
  setClient(client);
  let roomStyle = "SINGLE";

  // Query
  const HOTELS = gql`
    query hotels_by_room_style($roomStyle: Style!) {
      hotelsByRoomStyle(style: $roomStyle) {
        id
        name
        address {
          city
          state
        }
        amenities
        roomStyles
      }
    }
  `;
  const REMOVEHOTEL = gql`
  mutation RemoveHotel($removeHotelId: ID!) {
    removeHotel(id: $removeHotelId)
  }
  `;
  const removeHotel = mutation(REMOVEHOTEL);

  const hotels = query(HOTELS, {
    variables: { roomStyle },
  });
  
  const reload = () => {
    hotels.refetch();
  }

  $: hotels.refetch({ roomStyle });
  const removeHotelAction = async (hotelId) => {
    await removeHotel({
                variables: {
                  "removeHotelId": hotelId
                }
            });
    hotels.refetch();
  };
</script>

<Layout header>
  <div class="homepage">
    <div class="container">
      <div class="row">
        <div class="table-title w-100 mt-5">
          <div class="d-flex align-items-center justify-content-between w-100">
            <h1 class="home-title mb-5 text-center">Hotel List</h1>
            <select
              class="form-select"
              aria-label="Default select example"
              bind:value={roomStyle}
              on:change={reload}
            >
              <option value="SINGLE" selected>SINGLE</option>
              <option value="DOUBLE">DOUBLE</option>
              <option value="QUEEN">QUEEN</option>
              <option value="KING">KING</option>
              <option value="SUITE">SUITE</option>
            </select></div>
        </div>
        <div class="table-cover">
          <table class="table table-striped table-dark">
            <thead>
              <tr>
                <th class="text-left">Name</th>
                <th class="text-left">Address</th>
                <th class="text-left">Amenities</th>
                <th class="text-left">Room Styles</th>
                <th class="text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {#if hotels}
              {#if $hotels.loading}
                Loading...
              {:else if $hotels.error}
                Error: {$hotels.error.message}
                {:else}
                {#each $hotels.data.hotelsByRoomStyle as hotel}
                  <tr>
                    <td class="text-left">
                      <a href="./hotels/details/{hotel.id}">{hotel.name}</a>
                    </td>
                    <td class="text-left">
                      {hotel.address.city}, {hotel.address.state}
                    </td>
                    <td class="text-left">
                      {hotel.amenities}
                    </td>
                    <td class="text-left">
                      {hotel.roomStyles}
                    </td>
                    <td class="text-left">
                      <button on:click={() => removeHotelAction(hotel.id)}>Remove</button>
                    </td>
                  </tr>
                  {/each}
                  {/if}
                  {/if}
                </tbody>
              </table>
            </div>
          </div>
    </div>
  </div>
</Layout>
