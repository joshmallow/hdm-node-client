[![Build Status](http://ec2-35-156-28-255.eu-central-1.compute.amazonaws.com/jenkins/buildStatus/icon?job=chatbot/client-tests)](http://ec2-35-156-28-255.eu-central-1.compute.amazonaws.com/jenkins/job/chatbot/job/client-tests/)
# HdM Client #

This is a client for the Stuttgart Media University API. At the moment it provides four methods:

* search
* details
* menu
* searchDetails

To find out how to use the client and the methods, just check the test files.

The client currently does not support authentication. That means for example that you cannot search students.

### Running Tests ###

To run the tests, you can use `npm test`. In this case there is no need to install mocha globally.