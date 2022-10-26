<script>
    import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";
    import { setClient, mutation } from "svelte-apollo";	
    import MultiSelect from 'svelte-multiselect'
    import { PUBLIC_SERVER_URL } from '$env/static/public'

    import "../../../css/hotelDetail.css"
    import Layout from "../../Layout.svelte";

    
    const roomStyles =  ['SINGLE', 'DOUBLE', 'QUEEN', 'KING', 'SUITE'];
    const amenity = [`POOL`, `BREAKFAST`, `LAUNDRY`, `INTERNET`, `GYM`];
    const states = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

    let selectedAmenities = [];
    let selectedRoomStyles  = [];
    let selectedState = '';

	const client = new ApolloClient({
        uri: PUBLIC_SERVER_URL + "/graphql",
		cache: new InMemoryCache()
	});
	setClient(client);


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
            const hotelName = data.get("hotelName");
            const cityName = data.get("cityName");
            const floorNumber = data.get("floorNumber");
            const roomNumber = data.get("roomNumber");
            console.log("selectedAmenities : ", selectedAmenities);
            console.log("selectedRoomStyles : ", selectedRoomStyles);
            await addHotel({
                variables: {
                    "address": {
                        "city": cityName,
                        "state": selectedState
                    },
                    "name": hotelName,
                    "amenities": selectedAmenities,
                    "roomStyles": selectedRoomStyles
                },
                "numRooms": roomNumber,
                "numFloors": floorNumber
            });

            selectedAmenities=[];
            selectedRoomStyles=[];
            event.target.reset();

        })().catch(error => {
            // TODO
            console.error(error);
    })

}
  </script>
 
 <Layout header>
     <div class="hotel-detail-page">
         <div class="container">
             <h1 class="hotel-detail_title mb-5 text-center">Create Hotel</h1>
             <form on:submit|preventDefault="{handleSubmit}">
                <div class="row">
                    <div class="col-md-6 col-12">
                        <div class="form-group">
                            <label for="hotelName">Hotel Name</label>
                            <input
                            type="text"
                            class="form-control"
                            id="hotelName"
                            name="hotelName"
                            placeholder="Hotel Name"
                            />
                        </div>
                    </div>
                    <div class="col-md-6 col-12">
                        <div class="form-group">
                            <label for="Amenities">Amenities</label>
                            <MultiSelect bind:selected={selectedAmenities} name="amenity" options={amenity} />
                        </div>
            </div>
            <div class="col-md-6 col-12">
                <div class="form-group">
                    <label for="RoomStyles">Room Styles</label>
                    <MultiSelect bind:selected={selectedRoomStyles} name="roomStyle"  options={roomStyles} />
                </div>
            </div>
            <div class="col-md-6 col-12">
                <div class="form-group">
                    <label for="cityName">City Name</label>
                    <input
                    type="text"
                    class="form-control"
                    id="cityName"
                    name="cityName"
                    placeholder="City Name"
                    />
              </div>
            </div>
            <div class="col-md-6 col-12">
                <div class="form-group">
                <label for="cityName">State Name</label>
                <!-- <Select bind:selectedState options={states} /> -->
                <select
                class="form-select state-name"
                aria-label="Select State"
                default="SINGLE"
                bind:value={selectedState}>
                {#each states as state}
                <option value="{state}">{state}</option>   
                {/each}
            </select>
              </div>
            </div>
            <div class="col-md-6 col-12">
                <div class="form-group">
                    <label for="floorNumber">Floor Number</label>
                    <input
                    type="number"
                    class="form-control"
                  id="floorNumber"
                  name="floorNumber"
                  placeholder="Floor Number"
                  />
                </div>
            </div>
            <div class="col-md-6 col-12">
              <div class="form-group">
                <label for="roomNumber">Room Number</label>
                <input
                  type="number"
                  class="form-control"
                  id="roomNumber"
                  name="roomNumber"
                  placeholder="Room Number"
                  />
              </div>
            </div>
        </div>
        <button type="submit" class="btn btn-primary">Create</button>
    </form>
</div>
</div>
</Layout>
