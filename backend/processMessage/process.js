'use strict';

/**
 * This Lambda function grabs messages from SQS and searches for recommended
 * restaurant in elasticsearch.
 *
 * After Elasticsearch returns top three recommendations. We then use id to query
 * DynamoDB to retrieve complete information.
 *
 * The result is sent back to the user's phone.
 *
 */

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var ElasticSearch = require('elasticsearch');

// Set the region
AWS.config.update({
    region: "us-east-1"
});

// Create a SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
var queueURL = "your_AWS_SQS_queue_url";
var paramsSQS = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0
};

// Create a SNS service object
var sns = new AWS.SNS();

// Create a DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

// Initialize elasticsearch object
var elasticsearch = new ElasticSearch.Client({
    host: 'your_AWS_es_host_url',
    log: 'trace'
});

// Parameter for querying DynamoDB
var params;

// Fields to form response
var cuisine, date, people, time, phone;
var ret_name = [];
var ret_addr = [];

// Function that form response message and send it back via SNS
var form_response = function(){

    console.log(ret_name);
    console.log(ret_addr);

    // Construct the SNS message
    const recommendation = `Hello! Here are my ${cuisine} restaurant suggestions` +
        ` for ${people} people, for ${date} at ${time}:\n1. ${ret_name[0]}, located at ${ret_addr[0]}.\n` +
        `2. ${ret_name[1]}, located at ${ret_addr[1]}.\n3. ${ret_name[2]}, located at ${ret_addr[2]}.\nThanks for using our service.`;

    console.log(recommendation);

    var paramsSNS = {
        Message: recommendation,
        MessageStructure: 'string',
        PhoneNumber: `+1${phone}`
    };

    // Send the message to user's cell phone via SNS
    sns.publish(paramsSNS, function(err, data){
        if (err){
            console.log(err, err.stack);
        }
        else
            console.log(data);
    });
};


// The handler that will be called
exports.handler = (event, context, callback) => {
    try {
        sqs.receiveMessage(paramsSQS, function(err, data) {
            if (err) {
                console.log("Receive Error", err);
            } else if (data.Messages) {     // message received

                // Iterate through the messages we fetched, currently we only have one message
                for (const message of data.Messages){

                    const messageAttributes = message.MessageAttributes;
                    cuisine = messageAttributes.Cuisine.StringValue;
                    date = messageAttributes.Date.StringValue;
                    people = messageAttributes.People.StringValue;
                    time = messageAttributes.Time.StringValue;
                    phone = messageAttributes.Phone.StringValue;

                    // Search in elasticsearch
                    elasticsearch.search({
                        index: 'predictions',
                        type: 'Prediction',
                        body: {
                            query: {
                                match: {
                                    cuisine: cuisine
                                }
                            }
                        }
                    }).then(function (resp) {

                        var results = resp.hits.hits;
                        var ids = [];
                        // Retrieve the id of three recommended restaurants
                        // We will use them to query DynamoDB
                        ids[0] = results[0]._source.id;
                        ids[1] = results[1]._source.id;
                        ids[2] = results[2]._source.id;

                        for (var counter = 0; counter < ids.length; counter++){

                            params = {
                                TableName : 'yelp-restaurants',
                                ProjectionExpression:"id, #na, #lo",
                                ExpressionAttributeNames:{
                                    "#na": "name",
                                    "#lo": "location"
                                },
                                KeyConditionExpression: "id = :v1",
                                ExpressionAttributeValues: {
                                    ":v1": ids[counter]
                                }
                            };

                            docClient.query(params, function(err, data) {
                                if (err) {
                                    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                                } else {
                                    console.log("Query succeeded.");
                                    if (data.Items == null)
                                        console.log("Empty response");
                                    else{
                                        //console.log(data);
                                        data.Items.forEach(function(item) {   // will just return one item
                                            ret_name[ret_name.length] = item.name;
                                            ret_addr[ret_addr.length] = item.location;
                                            if (ret_name.length == ids.length)
                                                form_response();
                                        });
                                    }
                                }
                            });
                        }
                    }, function (err) {
                        console.trace(err.message);
                    });


                    // Delete the message in SQS
                    var deleteParams = {
                        QueueUrl: queueURL,
                        ReceiptHandle: message.ReceiptHandle
                    };
                    sqs.deleteMessage(deleteParams, function(err, data) {
                        if (err) {
                            console.log("Delete Error", err);
                        } else {
                            console.log("Message Deleted", data);
                        }
                    });
                }

            }
        });
    } catch (err) {
        callback(err);
    }
};
