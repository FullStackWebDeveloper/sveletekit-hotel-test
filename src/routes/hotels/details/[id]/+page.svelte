<script>
  import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";
  import "../../../../css/hotelDetail.css";

  // import { SvelteApolloClient } from "svelte-apollo-client";
  import { setClient, query, mutation } from "svelte-apollo";
  import Layout from "../../../Layout.svelte";
  export let data;
  // const client = new SvelteApolloClient({
  //     uri: "http://localhost:5000/graphql",
  //     cache: new InMemoryCache()
  // });

  const client = new ApolloClient({
    uri: "http://192.168.114.110:5000/graphql",
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

  // Mutation

  const ADD_HOTEL = gql`
    mutation create_hotel(
      $address: AddressInput!
      $name: String!
      $numFloors: Int
      $numRooms: Int
      $amenities: [Amenity!]
    ) {
      createHotel(
        address: $address
        name: $name
        numFloors: $numFloors
        numRooms: $numRooms
        amenities: $amenities
      ) {
        id
        name
        amenities
        address {
          city
          state
        }
        roomStyles
      }
    }
  `;
  const addHotel = mutation(ADD_HOTEL);

  function handleSubmit(event) {
    const data = new FormData(event.target);

    (async () => {
      const title = data.get("title");
      const author = data.get("author");

      await addHotel({
        variables: {
          address: {
            city: "Tampa",
            state: "FL",
          },
          name: "My hotel",
          amenities: ["GYM", "INTERNET"],
          roomStyles: ["SINGLE", "DOUBLE"],
        },
        numRooms: 20,
        numFloors: 5,
      });

      event.target.reset();

      // TEMP Explicitly refetch
      // (there's probably some way to explicitly update the cache, although search might not match)
      // books.refetch({ search });
    })().catch((error) => {
      // TODO
      console.error(error);
    });
  }
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
              <div class="d-flex">
                <p class="data-title mr-1">Name:</p>
                <p>{$hotel.data.hotel.name}</p>
              </div>
              <div class="d-flex">
                <p class="data-title mr-1">Address:</p>
                <p>
                  {$hotel.data.hotel.address.city}, {$hotel.data.hotel.address
                    .state}
                </p>
              </div>
              <div class="d-flex">
                <p class="data-title mr-1">Amenities offered:</p>
                <p>{$hotel.data.hotel.amenities}</p>
              </div>
              <div class="d-flex">
                <p class="data-title mr-1">Number of guests:</p>
                <p>{guestsNumber}</p>
              </div>
              <div class="d-flex">
                <p class="data-title mr-1">
                  Number of vacancies:<br />(by room style)
                </p>
                {#each Object.keys(numberOfvacancies) as roomType}
                  <p>{roomType}:</p>
                  <p>{numberOfvacancies[roomType]}</p>
                {/each}
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

  <h2>Add Book</h2>

  <form on:submit|preventDefault={handleSubmit}>
    <label>Title <input type="text" name="title" /></label>
    <label>Author <input type="text" name="author" /></label>
    <button type="submit">Add Book</button>
  </form>
</Layout>

<style>
  button {
    background: #ff3e00;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 2px;
  }
</style>
