<script>
    import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";

    // import { SvelteApolloClient } from "svelte-apollo-client";
    import { setClient, query, mutation } from "svelte-apollo";	
    export let data;
    // const client = new SvelteApolloClient({
    //     uri: "http://localhost:5000/graphql",
    //     cache: new InMemoryCache()
    // });
    
	const client = new ApolloClient({
        uri: "http://localhost:5000/graphql",
		cache: new InMemoryCache()
	});
	setClient(client);

    export let hotel;
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
        variables: { hotelId }
    });
    const getData = async () => {
        let result = await hotel.result()
        console.log(result)
    }
    getData()

    // Mutation

    const ADD_HOTEL = gql`
    mutation create_hotel($address: AddressInput!, $name: String!, $numFloors: Int, $numRooms: Int, $amenities: [Amenity!]) {
    createHotel(address: $address, name: $name, numFloors: $numFloors, numRooms: $numRooms, amenities: $amenities) {
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
                    "address": {
                        "city": "Tampa",
                        "state": "FL"
                    },
                    "name": "My hotel",
                    "amenities": [
                        "GYM",
                        "INTERNET"
                    ],
                    "roomStyles": [
                        "SINGLE",
                        "DOUBLE"
                    ]
                },
                "numRooms": 20,
                "numFloors": 5
            });

            event.target.reset();

            // TEMP Explicitly refetch
            // (there's probably some way to explicitly update the cache, although search might not match)
            // books.refetch({ search });
        })().catch(error => {
            // TODO
            console.error(error);
    })

}
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
  
  <!-- <button on:click={getHotels}>Get hotels</button> -->
  {#if hotel}
    {#if $hotel.loading}
      Loading...
    {:else if $hotel.error}
      Error: {$hotel.error.message}
    {:else}
    <ul>
      Address: {$hotel.data.hotel.name}
      Address: {$hotel.data.hotel.address.city}, {$hotel.data.hotel.address.state} 
        <li>
            {#each $hotel.data.hotel.floors as floor}
            <li>
              <a href="">{floor.id}</a>
            </li>
          {/each}
        </li>
    </ul>
    {/if}
  {/if}


  <h2>Add Book</h2>

<form on:submit|preventDefault="{handleSubmit}">
	<label>Title <input type="text" name="title" /></label>
	<label>Author <input type="text" name="author" /></label>

	<button type="submit">Add Book</button>
</form>
