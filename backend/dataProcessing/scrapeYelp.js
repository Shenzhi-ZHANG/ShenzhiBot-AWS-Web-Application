/**
 * This file scrapes 10000 Manhattan's restaurant information using Yelp-Fusion API.
 * The result in JSON format is written to a local file.
 *
 */

// Load Yelp SDK
const yelp = require('yelp-fusion');
var fs = require('fs');
var stream = fs.createWriteStream("restaurants.json", {flags:'a'});

// Set Yelp's API key
const apiKey = 'your_api_key';

// Create a yelp client with API key
const client = yelp.client(apiKey);

// Restaurant location
const location = "New York";

/*
    Of course we can scrape 10000 restaurants by issuing the search request
    200 times in a row and increase the offset value accordingly in each iteration.
    But to be safe, to not be banned by Yelp, it might be better to do things slowly.
 */
for (var offset = 0; offset < 100; offset+= 20) {
    // Construct the query message, the search field can be found in:
    // https://www.yelp.com/developers/documentation/v3/business_search
    const searchRequest = {
        location: location,
        limit: "20",            // Fifty is the maximum value
        term: "Spanish",        // Define your own cuisine hoice
        offset: "" + offset     // Use offset to navigate through the whole list
    };


    // Execute the query
    client.search(searchRequest).then(response => {

        const len = response.jsonBody.businesses.length;
        console.log(len)
        for (var i = 0; i < len; i++) {
            stream.write(JSON.stringify(response.jsonBody.businesses[i], null, 2) + ",\n");
        }
    }).catch(e => {
        console.log(e);
    });

}

// Stream ends after process terminates
// Note: If this file needs to be parsed by JSON.parse(), it is still lacking of '[]'