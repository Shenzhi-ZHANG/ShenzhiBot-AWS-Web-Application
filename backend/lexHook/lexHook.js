'use strict';

/**
 * This Lambda function is modified based on the 'OrderFlowers' sample Lambda function and
 * is designed for a chatbot that provides dining suggestions.
 *
 */

// --------------- Helpers to build responses which match the structure of the necessary dialog actions -----------------------

function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,
        },
    };
}

// Used for elicit slots
function delegate(sessionAttributes, slots) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Delegate',
            slots,
        },
    };
}

// Used for fulfillment of Greeting and ThankYou intents
function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

// Return a randomized hello message
const selectHello = function() {
    let helloArray = [
        'Hi! How can I help?',
        'Hi there! Need help?',
        'Hello! Let me know what I can help with today',
        'Hi there.'
    ];
    let randomNumber = Math.floor(Math.random() * 4);

    return helloArray[randomNumber];
};

// Return a randomized goodbye message
const selectThank = function() {
    let thankArray = [
        'You are welcome!',
        'My pleasure.',
        'You are welcome. Goodbye.',
        'Thanks for stopping by.'
    ];
    let randomNumber = Math.floor(Math.random() * 4);

    return thankArray[randomNumber];
};

// ---------------- Helper Functions --------------------------------------------------

function parseLocalDate(date) {
    /**
     * Construct a date object in the local timezone by parsing the input date string, assuming a YYYY-MM-DD format.
     * Note that the Date(dateString) constructor is explicitly avoided as it may implicitly assume a UTC timezone.
     */
    const dateComponents = date.split(/\-/);
    return new Date(dateComponents[0], dateComponents[1] - 1, dateComponents[2]);
}

function isValidDate(date) {
    try {
        return !(isNaN(parseLocalDate(date).getTime()));
    } catch (err) {
        return false;
    }
}

function buildValidationResult(isValid, violatedSlot, messageContent) {
    if (messageContent == null) {
        return {
            isValid,
            violatedSlot,
        };
    }
    return {
        isValid,
        violatedSlot,
        message: { contentType: 'PlainText', content: messageContent },
    };
}



function validateSlot(cuisine, date, time, people, location, phone) {

    // Check whether it is a valid cuisine type, this list is from Google search result
    if (cuisine) {
        const cuisineTypes = ['chinese', 'italian', 'japanese', 'spanish', 'french'];
        if (cuisineTypes && cuisineTypes.indexOf(cuisine.toLowerCase()) === -1) {
            return buildValidationResult(false, 'Cuisine', `We currently do not support ${cuisine} as a valid cuisine. Can you try a different one?`);
        }
    }

    // Check whether given date is valid
    if (date) { // if date is given
        if (!isValidDate(date)) {
            return buildValidationResult(false, 'Date', 'I did not understand that, what date would you like to make restaurant reservation?');
        }
        if (parseLocalDate(date) < new Date().setHours(0,0,0,0)) {
            return buildValidationResult(false, 'Date', 'The date you chose is not valid. What day would you like to make the reservation?');
        }
    }

    // Check whether the given time is valid
    if (time) {
        if (time.length !== 5) {    // the input is given as HH:MM
            // Not a valid time; use a prompt defined on the build-time model.
            return buildValidationResult(false, 'Time', null);
        }
        const hour = parseInt(time.substring(0, 2), 10);
        const minute = parseInt(time.substring(3), 10);
        if (isNaN(hour) || isNaN(minute)) {
            // Not a valid time; use a prompt defined on the build-time model.
            return buildValidationResult(false, 'Time', null);
        }
        if (date){  // if date is also given
            if (new Date(`${date} ${time}`) < new Date())
                return buildValidationResult(false, 'Time', 'The time is in the past. Please input time again.');
        }
    }

    // Check whether the given number of people is valid
    if (people) {
        const numberOfPeople = parseFloat(people);
        if (isNaN(numberOfPeople) || !Number.isInteger(numberOfPeople) || people <= 0)
            return buildValidationResult(false, 'People', 'The number is invalid. How many people are in your party?');
    }

    if (phone){
        if (phone.length != 10 || phone.match(/^[0-9]+$/) === null)
            return buildValidationResult(false, 'Phone', 'The phone number is not valid. Please input again.')
    }

    return buildValidationResult(true, null, null); // All slots are valid
}





// --------------- Functions that control the bot's behavior -----------------------

/**
 * Performs dialog management for dining suggestions. This Lambda function doesn't contain fulfillment.
 */
function recommendRestaurant(intentRequest, callback) {

    // Get the information in each slot:
    const cuisine = intentRequest.currentIntent.slots.Cuisine;
    const date = intentRequest.currentIntent.slots.Date;
    const time = intentRequest.currentIntent.slots.Time;
    const people = intentRequest.currentIntent.slots.People;
    const location= intentRequest.currentIntent.slots.Location;
    const phone = intentRequest.currentIntent.slots.Phone;
    const source = intentRequest.invocationSource;

    if (source === 'DialogCodeHook') {
        // Perform basic validation on the supplied input slots.
        // Use the elicitSlot dialog action to re-prompt for the first violation detected.
        const slots = intentRequest.currentIntent.slots;

        // Check each parameter
        const validationResult = validateSlot(cuisine, date, time, people, location, phone);

        if (!validationResult.isValid) {    // If invalid slot exists, buildValidationResult will set isValid to false
            slots[`${validationResult.violatedSlot}`] = null;   // reset the invalid slot
            // request the invalid slot again
            callback(elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name, slots, validationResult.violatedSlot, validationResult.message));
            return;
        }
    }

    // If the slots are valid, respond to customer
    const outputSessionAttributes = intentRequest.sessionAttributes || {};
    callback(delegate(outputSessionAttributes, intentRequest.currentIntent.slots));
    return;

}

/**
 * Generate random Hello for GreetingIntent.
 */
function randomHello(intentRequest, callback) {

    // Send a random hello message back
    callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: selectHello()}));
}



/**
 * Generate random Thank for ThankYouIntent.
 */
function randomThank(intentRequest, callback) {

    // Send a random hello message back
    callback(close(intentRequest.sessionAttributes, 'Fulfilled',
        { contentType: 'PlainText', content: selectThank()}));
}




// --------------- Intents -----------------------

/**
 * Called when the user specifies an intent for this skill.
 */
function dispatch(intentRequest, callback) {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);

    const intentName = intentRequest.currentIntent.name;

    // Dispatch to intent handlers, just deal with Dining Suggestions Intent
    if (intentName === 'DiningSuggestionsIntent') {
        return recommendRestaurant(intentRequest, callback);
    }else if (intentName === 'GreetingIntent'){ // Greeting intent
        return randomHello(intentRequest, callback);
    }else if (intentName === 'ThankYouIntent'){ // ThankYou intent
        return randomThank(intentRequest, callback);
    }

    throw new Error(`Intent with name ${intentName} not supported`);
}





// --------------- Main handler -----------------------

// Route the incoming request based on intent.
// The JSON body of the request is provided in the event slot.
exports.handler = (event, context, callback) => {
    try {
        // By default, treat the user request as coming from the America/New_York time zone.
        process.env.TZ = 'America/New_York';
        console.log(`event.bot.name=${event.bot.name}`);

        dispatch(event, (response) => callback(null, response));
    } catch (err) {
        callback(err);
    }
};
