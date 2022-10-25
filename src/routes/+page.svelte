<script>
    import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";
    import { setClient, query, mutation } from "svelte-apollo";	
    import '../css/homepage.css';

    const client = new ApolloClient({
        uri: "http://localhost:5000/graphql",
        cache: new InMemoryCache()
    });
     setClient(client);
 
     
     // Query
    let roomStyle = "SINGLE";
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
    //  const GETALLHOTELS = gql`
    //  	query Hotels {
    //  		hotels {
    //             id
    //             name
    //             address {
    //             city
    //             state
    //             }
    //             amenities
    //             roomStyles
    //  		}
    //  	}
    //  `;
 
    //  const hotels = query(GETALLHOTELS);
     const hotels = query(HOTELS, {
     	variables: { roomStyle }
     });
     async function getData() {
        let data = await hotels.result()
        console.log(data)
     }
     getData()
     function reload(e) {
        console.log(roomStyle)
        if (e) {

        } else {
            hotels.refetch();
        }
     }
 
     $: hotels.refetch({ roomStyle });
     const goDetails = (hotelId) => {
        console.log('asdfasdf')
        window.location.href = `./hotels/${hotelId}`
     }
   </script>
        
 <!-- <label>Search <input type="search" bind:value="{search}" /></label>
 
 <button on:click="{reload}">Reload</button> -->
  


<div class="homepage">
    <div class="container">
        <div class="d-flex flex-column align-items-end mb-5">
            <div class="d-flex align-items-center justify-content-end header py-3">
                <a href="./pages/createHotel.html" class="mr-3">Create Hotel
                <a href="./pages/register.html">Register
            </div>
            <input type="input" placeholder="Search" class="form-control search-input" />
            <select class="form-select" aria-label="Default select example" default="SINGLE" bind:value="{roomStyle}" on:change="{reload}">
                <option value="">ALL TYPES</option>
                <option value="SINGLE" selected>SINGLE</option>
                <option value="DOUBLE">DOUBLE</option>
                <option value="QUEEN">QUEEN</option>
                <option value="KING">KING</option>
                <option value="SUITE">SUITE</option>
              </select>
        </div>
        <div class="row">
            <div class="table-title">
                <h1 class="home-title mb-5 text-center">Hotel List</h1>
            </div>
            <table class="table-fill">
                <thead>
                    <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Address</th>
                        <th class="text-left">Amenities</th>
                        <th class="text-left">Room Styles</th>
                    </tr>
                </thead>
                <tbody class="table-hover">
                    {#if hotels}
                        {#if $hotels.loading}
                            Loading...
                            {:else if $hotels.error}
                                Error: {$hotels.error.message}
                            {:else}
                            {#each $hotels.data.hotelsByRoomStyle as hotel}
                            <tr on:click="{() => goDetails(hotel.id)}">
                                <td class="text-left">
                                    {hotel.name}
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
                            </tr>
                            {/each}
                        {/if}
                    {/if}
                </tbody>
            </table>

        </div>
    </div>
</div>