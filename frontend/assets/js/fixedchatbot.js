/* ----- Initialize api sdk ----- */
var apigClient = apigClientFactory.newClient();

/*
    Cognito will include a code in the redirect page's url
    We need to use the code to exchange for an Access and ID Token
    So now let's parse the code out from the url
*/
var parseCode = function (field, url) {
    if (!url) url = window.location.href;           // the href (URL) of the current page
    field = field.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + field + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};


/*
    This method exchanges the Authorization Code received from Cognito upon a successful login,
    with temporary accessKey and secretKey IAM credentials.
 */
var exchangeAuthCodeForCredentials = function ({
                                                   auth_code, client_id, identity_pool_id, aws_region, user_pool_id, cognito_domain_url, redirect_uri
                                               }) {
    console.log(auth_code);
    return new Promise((resolve, reject) => {
        var settings = {
            url: `${cognito_domain_url}/oauth2/token`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                grant_type: 'authorization_code',
                client_id: client_id,
                redirect_uri: redirect_uri,
                code: auth_code
            }
        };

        $.ajax(settings).done(function (response) {
            console.log('oauth2 token call responded');

            if (response.id_token) {
                // Add the User's Id Token to the Cognito credentials login map.
                AWS.config.credentials.clearCachedId();   // clear before a new user logs in
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: identity_pool_id,
                    Logins: {
                        [`cognito-idp.${aws_region}.amazonaws.com/${user_pool_id}`]: response.id_token
                    }
                });

                AWS.config.credentials.refresh((error) => {
                    if(error) {
                        reject(error);
                    } else {
                        console.log('successfully logged in');
                        resolve(AWS.config.credentials);}
                });
            } else {
                reject(response);
            }
        });
    });
};


$(document).ready(function () {
    var $messages = $('.messages-content'),
        d, h, m,
        i = 0;

    /* ----- configure the user data ----- */
    var awsRegion = 'your_region';
    var userPoolId = 'your_user_pool_id';
    var clientId = 'your_root_user_id';
    var identityPoolId = 'your_identity_pool_id';
    var cognitoDomainUrl = 'your_cognito_domain_url';
    var cognitoRedirectUri = 'your_cognito_redirect_page_url';

    /* ----- Getting AWS credentials ----- */
    // Initialize the Amazon Cognito credentials provider
    AWS.config.region = awsRegion;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId
    });

    /* ----- Exchange credentials ----- */
    exchangeAuthCodeForCredentials({
        auth_code: parseCode('code'), // get the HTTP query parameter, returned by Cognito
        client_id: clientId,
        identity_pool_id: identityPoolId,
        user_pool_id: userPoolId,
        aws_region: awsRegion,
        cognito_domain_url: cognitoDomainUrl,
        redirect_uri: cognitoRedirectUri
    }).then((credentials) => {
        console.log('credentials received');

        //  initialize SDK with credentials to sign the API calls
        apigClient = apigClientFactory.newClient({
            accessKey: AWS.config.credentials.accessKeyId,
            secretKey: AWS.config.credentials.secretAccessKey,
            sessionToken: AWS.config.credentials.sessionToken
        });

        console.log('sdk initialized successfully');
    }).catch((error) => {
        console.log('token exchange error', error);
    });

    /* ----- Display the chat interface ----- */
    $('.chat').removeClass('hide');   // display the chat box

    /* ----- Send welcome message ----- */
    $(window).load(function () {
        $('.messages-content').mCustomScrollbar();
        insertResponseMessage('Hi there, how can I help? For example, you may ask me to find a restaurant.');
    });

    /* ----- Update scrollbar ----- */
    function updateScrollbar() {
        $('.messages-content').mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
            scrollInertia: 10,
            timeout: 0
        });
    }

    /* ----- Set current time ----- */
    function setDate() {
        d = new Date()
        if (m != d.getMinutes()) {
            m = d.getMinutes();
            $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
        }
    }

    /* -----  Calling API----- */
    function callChatbotApi(message) {
        // The three parameters passed to api call are:
        // params, body, additionalParams
        // params and additionalParams = {}
        return apigClient.chatbotPost({}, {
            messages: [{
                type: 'unstructured',
                unstructured: {
                    text: message
                }
            }]
        }, {});
    }

    /* ----- Send the message to backend and display response ----- */
    function insertMessage() {
        msg = $('.message-input').val();    // grab the content that user inputs
        if ($.trim(msg) == '') {            // if the input message is empty
            return false;
        }
        $('<div class="message message-personal">' + msg + '</div>').appendTo($('.mCSB_container')).addClass('new');
        setDate();
        $('.message-input').val(null);

        updateScrollbar();
        callChatbotApi(msg)                     // call api to send msg
            .then((response) => {
                console.log(response);          // log the response
                var data = response.data;       // get the response from backend

                if (data.messages && data.messages.length > 0) {
                    console.log('received ' + data.messages.length + ' messages');

                    var messages = data.messages;

                    for (var message of messages) {
                        if (message.type === 'unstructured') {
                            insertResponseMessage(message.unstructured.text);   // display messaged sent back from backend
                        } else {                    // only unstructured message type is supported
                            console.log('not implemented');
                        }
                    }
                } else {                        // handle empty response
                    insertResponseMessage('Response message error. Please try again later.');
                }
            }).
        catch((error) => {
            console.log('getting response error', error);
            insertResponseMessage('Cannot get reply now. Please try again later.');
        });
    }

    /* ----- Display response from backend ----- */
    function insertResponseMessage(content) {
        $('<div class="message loading new"><figure class="avatar"><img src="http://flask.com/wp-content/uploads/dos-equis-most-interesting-guy-in-the-world-300x300.jpeg" /></figure><span></span></div>').appendTo($('.mCSB_container'));

        setTimeout(function () {
            $('.message.loading').remove();
            $('<div class="message new"><figure class="avatar"><img src="http://flask.com/wp-content/uploads/dos-equis-most-interesting-guy-in-the-world-300x300.jpeg" /></figure>' + content + '</div>').appendTo($('.mCSB_container')).addClass('new');
            setDate();
            i++;
            updateScrollbar();
        }, 500);
    }

    // if the user hits submit button, call insertMessage
    $('.message-submit').click(function () {
        insertMessage();
    });

    // if the user hit "enter", call insertMessage
    $(window).on('keydown', function (e) {
        if (e.which == 13) {
            insertMessage();
            return false;
        }
    })

});

