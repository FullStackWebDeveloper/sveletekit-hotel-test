<script>
  import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";
  import { setClient, query} from "svelte-apollo";
  import { PUBLIC_SERVER_URL } from '$env/static/public'
  import "../../../css/floorDetail.css";
  import Layout from "../../Layout.svelte";
  export let data;

  const client = new ApolloClient({
    uri: PUBLIC_SERVER_URL + "/graphql",
    cache: new InMemoryCache(),
  });
  setClient(client);

  let floorDetail;
  let floor_id = data.floors_id[0];
  let hotel_id = data.floors_id[1];

  // Query

  const FLOORDETAILS = gql`
    query Hotel($floorHotelId: ID!, $floorId: ID!) {
      floor(hotelId: $floorHotelId, id: $floorId) {
        guests {
          arrivalDate
          id
          name
        }
        hotel {
          amenities
        }
        id
        index
        rooms {
          style
          number
          guests {
            id
          }
        }
      }
    }
  `;

  floorDetail = query(FLOORDETAILS, {
    variables: { floorHotelId: hotel_id, floorId: floor_id },
  });

</script>

<Layout header>
  <div class="floor-detail-page">
    <div class="container">
      <h1 class="floor-detail_title mb-5 text-center">Floor Detail</h1>
      {#if floorDetail}
        {#if $floorDetail.loading}
          Loading...
        {:else if $floorDetail.error}
          Error: {$floorDetail.error.message}
        {:else}
          <div class="d-flex flex-wrap justify-content-around">
            <div class="d-flex">
              <p class="data-title mr-1">Floor number:</p>
              <p>1</p>
            </div>
            <div class="d-flex">
              <p class="data-title mr-1">Number of guests:</p>
              <p>{$floorDetail.data.floor.guests.length}</p>
            </div>
            <div class="d-flex">
              <p class="data-title mr-1">Number of rooms:</p>
              <p>
                {$floorDetail.data.floor.rooms.length}
              </p>
            </div>
          </div>
        {/if}
      {/if}
      <h2 class="floow-list-title text-center mt-5 mb-4">Room List</h2>
      <table class="table table-striped table-dark">
        <thead>
          <tr>
            <th scope="col">Room Number</th>
            <th scope="col">Style</th>
            <th scope="col">Guests</th>
          </tr>
        </thead>
        <tbody>
          {#if floorDetail}
            {#if $floorDetail.loading}
              Loading...
            {:else if $floorDetail.error}
              Error: {$floorDetail.error.message}
            {:else}
              {#each $floorDetail.data.floor.rooms as room}
                <tr>
                  <td>{room.number}</td>
                  <td>{room.style}</td>
                  <td>{room.guests.length}</td>
                </tr>
              {/each}
            {/if}
          {/if}
        </tbody>
      </table>
    </div>
  </div>
</Layout>