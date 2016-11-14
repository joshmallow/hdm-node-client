[![Build Status](http://ec2-35-156-28-255.eu-central-1.compute.amazonaws.com/jenkins/buildStatus/icon?job=chatbot/client-tests)](http://ec2-35-156-28-255.eu-central-1.compute.amazonaws.com/jenkins/job/chatbot/job/client-tests/)
# HdM Client #

This is a client for the Stuttgart Media University API. The following resources are supported at the moment:

* search
* details
* menu

The API only supports GET operations.

The client currently does not support authentication. That means for example that you cannot search students. To see how to use the client, just check the test files.

### Running Tests ###

To run the tests, you can use `npm test`. In this case there is no need to install mocha globally.