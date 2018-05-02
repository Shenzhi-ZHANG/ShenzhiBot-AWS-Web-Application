# ShenzhiBot-AWS-Web-Application

A scalable AWS-based web application that provides intelligent dining suggestions to users.

Demo
---

Please click [here](https://s3.amazonaws.com/shenzhizhang.chatbot/index.html) to visit the demo page.

This bot is designed to provide **dining recommendations**. The recommendation process can be invoked by sending messages like "I want to find a place to eat", "I want to find a restaurant", etc.

***Please note that you must sign up first*** to get access to the chat interface(if you try to open ```chat.html``` directly, the chat interface will be hidden).

![image](https://github.com/Shenzhi-ZHANG/ShenzhiBot-AWS-Web-Application/blob/master/diagram.png)

- - - -

How to get the application to work
---

*Some AWS credentials, API keys and application-specific urls are removed from the code. You should replace things like 'your_redirect_page_url' with your own url.*

A possible work flow:

1. Design your web API with swagger and import it into **AWS API Gateway**.

2. Create a lambda function(```backend/index```) which will be invoked by **AWS API Gateway** to perform the chat operation, i.e grabbing message sent from user, sending it to the backend, replying to the frontend with your response.

3. Enable CORS.

4. Test your **API Gateway** using customized test cases. Then deploy API, include generated SDK into your frontend code.

5. Use **AWS S3**'s static website hosting to host your website. (```fronend/```)

6. Set up **AWS Cognito** user pool to manage your users.

7. Generate a login page using root-user, redirect page url, etc.

8. Create an Identity Pool to provision temporary **AWS IAM** credentials to your logged in users.

9. Enable **AWS IAM** authentication on your **API Gateway** so that only authenticated users can invoke the API.

10. Finish up the frontend script so that it creates temporary credentials and invoke API Gateway properly. (```frontend/assets/js/fixedchatbot.js```)

11. Create a **AWS Lex** Bot and define intents. 

12. Train the **AWS Lex** Bot so that it can precisely catch all intents.

13. Implement a code hook to validate user's input or customize reply messages. (```backend/lexHook```)

14. Implement a lambda function as fulfillment code hook to push user's request into **AWS SQS** making the application scalable.(```backend/lexFulfill```)

15. Include the generated SDK for **AWS Lex** into your frontend scripts.

16. Write scripts for scraping Yelp using **Yelp-Fusion API**. Download metadata for a large number of restaurants.(```backend/dataProcessing```)

17. Create a **AWS DynamoDB** database which stores full restaurants data.

18. Format the restaurant data and filter out some unuseful attributes. You may mark the restaurants user likes. The marked data will be used as training data.(```backend/dataProcessing```)

19. Feed the training data into **AWS ML** to create a machine learning Model. Use the rest of data to test the model.

20. Download the output of machine learning model.

21. Create an **AWS Elastic Search Service** domain and **elasticsearch** index and type. Indexing the predicted restaurant data.

22. Implement another lambda function that pulls messages from **AWS SQS** and searches in **elasticsearch**. Use the returned restaurant ids to query **DynamoDB** to obtain complete information about the restaurants. Then call **AWS SNS** to send response to user's cell phone.

23. Add a rule in **AWS CloudWatch** to trigger the lambda function in 22 periodically.

- - - -

Notes
---

#### API Gateway ####

**If you get 403 forbidden after using IAM roles to secure API Gateway, check whether the CORS is correctly configured. You may try to enable it manually:**

```
Add OPTIONS method, choose as integration type "mock"
For each Method of a resource
Go to Response Method
Add all the response method that should be supported (i.e. 200, 500, etc.)
For each response code set Response Headers to
    * X-Requested-With
    * Access-Control-Allow-Headers
    * Access-Control-Allow-Origin
    * Access-Control-Allow-Methods
Go to Integration Response, select one of the created response codes, then Header Mappings
Insert default values for headers example:
    * X-Requested-With: '*'
    * Access-Control-Allow-Headers: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with,x-amz-security-token'
    * Access-Control-Allow-Origin: '*'
    * Access-Control-Allow-Methods: 'POST,GET,OPTIONS'
This operation is repeated for each method, including the newly created OPTIONS
Deploy the API to a stage
```

#### AWS Lex ####

**How to train Lex Bot:**

For each intent, 10 to 15 sample utterances are provided to train the bot so that it can be more robust to various kinds of inputs.

#### Lambda ####

**How to create Deployment Package**

In order to use Yelp-Fusion API in Lambda function, we need to create a **deployment package** for Node.js. The steps are as follow:

```
1. Create a new directory and write Node.js program. The Name of this file will be used as the handler when we create Lambda function. For example, if we name our program 'process.js', the Handler will be process.handler

2. Run ```npm install your-package --save``` in our directory.

3. Zip our directory and upload the .zip file to Lambda. Remember to change the Handler to 'process.handler'.

4. Don't forget to test the created Lambda deployment package.
```

If you find that there is error between two AWS components, check whether you have set up correct role. For example, configure Lambda function's role to give it access to SQS and Lex.

#### Data Processing ####

Because we don't want to be banned from Yelp because of calling Yelp API too quick. The ```scrapeYelp.js``` file does not finish all the tasks. If you just run this script, it will just return 100 restaurants in one cuisine. Additionally, the output file's format needs to be modified in case that you run ```JSON.parse()``` on it.

**About Training Data in FILE_2.csv**

The training data is stored in ```FILE_2.csv```. I just mark the first 100 restaurants as 'recommended' and the next 100 restaurants as 'not recommended'. For real training results, you should find a way to mark your favorite restaurants.

#### Amazon ML ####

The training data is uploaded into S3. **Because Amazon ML doesn't support '-' or '/' in the data field, they should be replaced.**

#### Amazon Elasticsearch Service ####

To avoid getting charged(too much) by elastic search service, make sure you create only one instance (for 750 hours limit) with t2.micro.elasticsearch/small storage type.

The aws-es domain is given access to some specific IP addresses. For detailed steps, check 'Setting up AWS Elastic Service domain' in useful links.

- - - -

Several Useful Links
---

Sending and Receiving Messages in Amazon SQS

https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sqs-examples-send-receive-messages.html

Creating a Deployment Package (Node.js)

https://docs.aws.amazon.com/lambda/latest/dg/nodejs-create-deployment-pkg.html

Schedule AWS Lambda Functions Using CloudWatch Events

https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/RunLambdaSchedule.html

Lambda Function Input Event and Response Format

https://docs.aws.amazon.com/lex/latest/dg/lambda-input-response-format.html

Set up DynamoDB locally:

https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html

java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

Operation on DynamoDB:

https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.html

Setting up AWS Elastic Service domain:

https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-gsg-create-domain.html

Upload Data to an Amazon ES Domain for Indexing:

https://docs.aws.amazon.com/elasticsearch-service/latest/developerguide/es-gsg-upload-data.html

How to use elasticsearch with Node.js:

https://github.com/elastic/elasticsearch-js
