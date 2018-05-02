/**
 * This .js file loads the restaurant metadata and create a csv File from it.
 * Since we will generate multiple csv file, we name this file FILE_1.csv
 *
 */

var fs = require('fs');
var stream = fs.createWriteStream("FILE_1.csv", {flags:'a'});

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

// Write the headers, do not have recommended column yet
var message = "RestaurantID,Cuisine,Rating,NumberOfReview";
stream.write(message + "\n");   // DO NOT add comma here

// Iterate through each JSON object, upload to DynamoDB
allRestaurants.forEach(function(restaurant) {
    var message = '"' + restaurant.id.replace(/-|\//g, "_") + '",' + '"' +
        restaurant.categories[0].title.replace(/-|\//g, "_") + '",' +
        restaurant.rating + ',' + restaurant.review_count;
    stream.write(message + "\n");
});
