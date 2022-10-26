<script>
  import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";
  import { PUBLIC_SERVER_URL } from '$env/static/public'
  import { setClient, query, mutation } from "svelte-apollo";
  
  import Layout from "../../../Layout.svelte";
  import "../../../../css/hotelDetail.css";
  export let data;

  const client = new ApolloClient({
    uri: PUBLIC_SERVER_URL + "/graphql",
    cache: new InMemoryCache(),
  });
  setClient(client);

  let hotel;
  let guestsNumber = 0;
  let numberOfvacancies = {};
  let hotelId = data.hotel_id;

  // Query

  const HOTELDEAILS = gql`
    query hotel_detail($hotelId: ID!) {
      hotel(id: $hotelId) {
        id
        name
        address {
          city
          state
        }
        amenities
        floors {
          index
          id
          rooms {
            guests {
              name
              id
            }
            style
          }
        }
      }
    }
  `;

  hotel = query(HOTELDEAILS, {
    variables: { hotelId },
  });
  const getData = async () => {
    let hotel_result = await hotel.result();
    hotel_result.data.hotel.floors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        guestsNumber += room.guests.length;
        if (room.guests.length == 0) {
          numberOfvacancies[room.style] = numberOfvacancies[room.style]
            ? numberOfvacancies[room.style] + 1
            : 1;
        }
      });
    });
  };
  getData();

</script>

<Layout header>
  <div class="hotel-detail-page">
    <div class="container">
      <h1 class="hotel-detail_title mb-5 text-center">Hotel Detail</h1>
      {#if hotel}
        {#if $hotel.loading}
          Loading...
        {:else if $hotel.error}
          Error: {$hotel.error.message}
        {:else}
          <div class="row">
            <div class="col-md-8 col-12 detail-panel">
              <div class="row">
                <p class="data-title col-4">Name:</p>
                <p class="col-8">{$hotel.data.hotel.name}</p>
              </div>
              <div class="row">
                <p class="data-title col-4">Address:</p>
                <p class="col-8">
                  {$hotel.data.hotel.address.city}, {$hotel.data.hotel.address
                    .state}
                </p>
              </div>
              <div class="row">
                <p class="data-title col-4">Amenities offered:</p>
                <p class="col-8">{$hotel.data.hotel.amenities}</p>
              </div>
              <div class="row">
                <p class="data-title col-4">Number of guests:</p>
                <p class="col-8">{guestsNumber}</p>
              </div>
              <div class="row">
                <p class="data-title col-4">
                  Number of vaca8cies:<br />(by room style)
                </p>
                <p class="col-8 d-flex flex-wrap align-items-center">
                {#each Object.keys(numberOfvacancies) as roomType}
                  <p class="mr-2">{roomType}({numberOfvacancies[roomType]})</p>
                {/each}
                </p>
              </div>
            </div>
            <div class="col-md-4 col-12 text-center">
              <h2 class="floor-list-title mb-4">Floor List</h2>
              {#each $hotel.data.hotel.floors as floor}
                <a href="/floors/{floor.id}-{hotelId}">{floor.index}</a>
              {/each}
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</Layout>
