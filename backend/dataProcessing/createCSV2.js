/**
 * This .js file loads the restaurant data and mark the first 100 restaurants as 'recommended'
 * and the next 100 restaurants as 'not recommended'.
 *
 * Note: I'm too lazy to look through these restaurants. If you want real and good training
 * performance, you should find a way to mark these restaurants correctly.
 *
 * This csv file is names FILE_2.csv.
 *
 */

var fs = require('fs');
var stream = fs.createWriteStream("FILE_2.csv", {flags:'a'});

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
var message = "RestaurantID,Cuisine,Rating,NumberOfReview,Recommended";
stream.write(message + "\n");   // DO NOT add comma here



// Mark 100 'recommended' restaurants
for (var counter = 0; counter < 100; counter++){
    const curRestaurant = allRestaurants[counter];

    // Amazon ML doesn't support '-' or '/' in the data field
    // We replace them by '_'
    var message = '"' + curRestaurant.id.replace(/-|\//g, "_") + '",' + '"' +
        curRestaurant.categories[0].title.replace(/-|\//g, "_") + '",' +
        curRestaurant.rating + ',' + curRestaurant.review_count + ',1';
    stream.write(message + "\n");
}



// Mark 100 'not recommended' restaurants
for (var counter = 100; counter < 200; counter++){
    const curRestaurant = allRestaurants[counter];

    // Amazon ML doesn't support '-' or '/' in the data field
    // We replace them by '_'
    var message = '"' + curRestaurant.id.replace(/-|\//g, "_") + '",' + '"' +
        curRestaurant.categories[0].title.replace(/-|\//g, "_") + '",' + curRestaurant.rating + ',' +
        curRestaurant.review_count + ',0';
    stream.write(message + "\n");
}
