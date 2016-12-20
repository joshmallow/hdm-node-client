[![Build Status](http://ec2-35-156-28-255.eu-central-1.compute.amazonaws.com/jenkins/buildStatus/icon?job=chatbot/client-tests)](http://ec2-35-156-28-255.eu-central-1.compute.amazonaws.com/jenkins/job/chatbot/job/client-tests/)
# HdM Client #

This is a client for the Stuttgart Media University API.

## Getting Started ##

First, you have to install the client:
```
npm install hdm-client
```

Now you can import it and create a client instance:
```
const Client = require('hdm-client');
const client = new Client();
```

This will use the default api url. If you want to use a different one, you can do that:
```
const client = new Client('https://myApi/v0/');
```

Now you can use the client to access the api. Let's see where Mr Smith has his office:

```
client.searchDetails('person', 'Smith', {maxResults: 1}, function (err, result) {
    console.log(result[0].room);
});
```

## API ##

####`search(type, query, options, callback)`####
- `type {string}` - all/room/person/event/lecture
- `query {string}` - Your search query
- `options {object}` - maxResults
- `callback {function}` - Called with the search result (error first)  

####`details(type, id, options, callback)`####
- `type {string}` - room/person/event/lecture
- `id {number}` - id of the ressource
- `options {number}` - None
- `callback {function}` - Called with the details (error first)

####`menu(options, callback)`####
- `options {number}` - None
- `callback {function}` - Called with the menu (error first)

####`searchDetails(type, query, options, callback)`####
- `type {string}` - all/room/person/event/lecture
- `query {number}` - Your search query
- `options {number}` - maxResults
- `callback {function}` - Called with the details of all search results (error first)

The client currently does not support authentication. That means that you won't find any students when searching persons.

### Options ###
####`maxResults {number}`####
Restricts the number of results that are presented to you. Used for `search` this does not improve performance, for `searchDetails` it does.

### Running Tests ###

There are three scripts you can use to run tests and analyse the code:
- `npm test`: Runs all the unit tests
- `npm run lint`: Runs JSHint (Rules can be found in `.jshintrc`)
- `npm run jscs`: Runs JSCS (Rules can be found in `.jscsrc`)

## ISC Licence ##

Copyright (c) 2016, Jonas Scheffner

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.