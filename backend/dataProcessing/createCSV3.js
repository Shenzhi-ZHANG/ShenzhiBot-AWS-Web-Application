/**
 * This .js file loads the restaurant data and converts the restaurant info except the
 * first two hundred which has been used to train our machine learning model to
 * a .csv file. This file will be used to store test data.
 *
 * This csv file is named FILE_3.csv.
 *
 * We will evaluate our ML model using this data set.
 *
 */

var fs = require('fs');
var stream = fs.createWriteStream("FILE_3.csv", {flags:'a'});

// A helper function that concatenates the addresses
function getAddress(result){
    var addr = result.location.address1;
    if (result.location.address2 === null || result.location.address2 === "")
        return addr;
    addr = addr + result.location.address2;
    if (result.location.address3 === null || result.location.address3 === "")
        return addr;
    return addr + result.location.address3;
}



// Read data into program from local file
var allRestaurants = JSON.parse(fs.readFileSync('restaurants.json', 'utf8'));

// Write the headers
var message = "RestaurantID,Cuisine,Rating,NumberOfReview";
stream.write(message + "\n");   // DO NOT add comma here

// Take out the remaining restaurants
for (var counter = 200; counter < allRestaurants.length; counter++){
    const curRestaurant = allRestaurants[counter];

    // Amazon ML doesn't support '-' or '/' in the data field
    // We replace them by '_'
    var message = '"' + curRestaurant.id.replace(/-|\//g, "_") + '",' + '"' +
        curRestaurant.categories[0].title.replace(/-|\//g, "_") + '",' +
        curRestaurant.rating + ',' + curRestaurant.review_count;
    stream.write(message + "\n");
}
