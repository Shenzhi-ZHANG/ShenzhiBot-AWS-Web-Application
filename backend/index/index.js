'use strict';

/*
  index.js receives messages from APIgateway and pass them to Amazon Lex.
  Lex's response will be forwarded back to the client.
 */
var AWS = require('aws-sdk');
var lexruntime = new AWS.LexRuntime();

// Build unstructured message
function buildUnstructuredMessage(text) {
    let response = [];
    response.push({
        type: 'unstructured',
        unstructured: {
            text: text,
            timestamp: new Date().toISOString()
        }
    });
    return response;
}


// Send message to Lex
const callLex = (message) => {
    return new Promise((resolve, reject) => {
        var params = {
            botAlias: 'Shenzhi',
            /* required */
            botName: 'ShenzhiBot',
            /* required */
            inputText: message,
            /* required */
            userId: '1209',
            /* required */
            //requestAttributes: {
            //    '<String>': 'STRING_VALUE',
                /* '<String>': ... */
            //},
            //sessionAttributes: {
             //   '<String>': 'STRING_VALUE',
                /* '<String>': ... */
            //}
        };

        // Send a request using LexRuntime
        lexruntime.postText(params, function(err, data) {
            if (err) reject(err);
            else resolve(data); // successful response
        });
    });
};



// Handler
exports.handler = (event, context, callback) => {
  console.log('request for disambiguation');

  let messages = null;  

  try {
    if ('messages' in event && event.messages.length > 0) {
      messages = event.messages;
    } else {
      throw new Error('bad request: missing messages key');
    }

    let responseMessages = [];
    const newMessage = messages[0];
    
    console.log(newMessage);
    if (newMessage.type === 'structured'){
      console.log('unhandled');   // not updating responseMessages
    }else if (newMessage.type === 'unstructured'){
       // Send the message to Lex
       callLex(newMessage.unstructured.text)
                .then((lexResponse) => {    // we get a response
                    // create response
                    responseMessages = buildUnstructuredMessage(lexResponse.message);
                    if (responseMessages.length === 0) {        // response is empty
                      responseMessages.push(buildUnstructuredMessage('Sorry, I\'m not sure what you mean. Can you rephrase?'));
                    }
                    console.log('responding with messages', responseMessages);
                    // Send the response back to the user
                    callback(null, {
                      messages: responseMessages
                    });
                })
                .catch((error) => {
                    console.log('Error: ', error);
                    callback(error);
                });
    }
  } catch (error) {
    console.log(error);
    callback(error);
  }
};

