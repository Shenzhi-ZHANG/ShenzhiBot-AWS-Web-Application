/**
 * This .js file loads the data stored in a file to DynamoDB.
 *
 */

/* Populate the given table */
var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
    region: "your_region",
    endpoint: "your_endpoint"
});

var docClient = new AWS.DynamoDB.DocumentClient();

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

console.log("Importing restaurant info into DynamoDB. Please wait.");

// Read data into program from local file
var allRestaurants = JSON.parse(fs.readFileSync('restaurants.json', 'utf8'));

// Iterate through each JSON object, upload to DynamoDB
allRestaurants.forEach(function(restaurant) {

    var params = {
        TableName: "yelp-restaurants",
        Item: {
            // Extract two primary keys
            "id":  restaurant.id.replace(/-|\//g, "_"),
            "name": restaurant.name.replace(/-|\//g, "_"),
            "insertedAtTimestamp": new Date().toISOString()
        }
    };

    // The remaining keys are different form restaurant to restaurant
    // Therefore, we examine the attributes one by one
    // Be careful: An attributeValue may not contain an empty string
    if (restaurant.alias && restaurant.alias != "")
        params.Item.alias = restaurant.alias;

    if (restaurant.image_url && restaurant.image_url != "")
        params.Item.image_url = restaurant.image_url;

    params.Item.is_closed = restaurant.is_closed;

    if (restaurant.url && restaurant.url != "")
        params.Item.url = restaurant.url;

    if (restaurant.review_count)
        params.Item.review_count = restaurant.review_count;

    if (restaurant.categories && restaurant.categories.length != 0) {
        params.Item.categories = [];
        params.Item.categories = params.Item.categories.concat(restaurant.categories);
    }

    if (restaurant.rating)
        params.Item.rating = restaurant.rating;

    if (restaurant.coordinates)
        params.Item.coordinates = restaurant.coordinates;

    if (restaurant.location) {
        params.Item.location = getAddress(restaurant);
        params.Item.zipcode = restaurant.location.zip_code;
    }
    if (restaurant.phone && restaurant.phone != "")
        params.Item.phone = restaurant.phone;

    if (restaurant.display_phone && restaurant.display_phone != "")
        params.Item.display_phone = restaurant.display_phone;

    if (restaurant.distance)
        params.Item.distance = restaurant.distance;

    if (restaurant.price && restaurant.price != "")
        params.Item.price = restaurant.price;

    if (restaurant.transactions && restaurant.transactions.length != 0) {
        params.Item.transactions = [];
        params.Item.transactions = params.Item.transactions.concat(restaurant.transactions);
    }


    docClient.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add restaurant", restaurant.name, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", restaurant.name);
        }
    });
});