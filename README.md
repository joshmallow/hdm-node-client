[![Build Status](https://travis-ci.org/jscheffner/hdm-node-client.svg?branch=master)](https://travis-ci.org/jscheffner/hdm-node-client) [![Coverage Status](https://coveralls.io/repos/github/joshmallow/hdm-node-client/badge.svg?branch=master)](https://coveralls.io/github/joshmallow/hdm-node-client?branch=master) [![node](https://img.shields.io/node/v/hdm-client.svg)]() [![license](https://img.shields.io/npm/l/hdm-client.svg)](https://github.com/jscheffner/hdm-node-client#isc-licence)
# HdM Client #

This is an unofficial client for the Stuttgart Media University API.

## Notice 

**The module should still work but the underlying API might provide out of date data.**

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

This will use the default api url. If you want to use a different one, you can set the global host option like that:
```
const client = new Client({ host: 'https://myApi/v0/' });
```

Now you can use the client to access the api. Let's see where Mr Smith has his office:

```
client.searchDetails('person', 'Smith', {maxResults: 1}, function (err, result) {
    console.log(result[0].room);
});
```

## API ##

#### `constructor(options = { host: 'https://hdmapp.mi.hdm-stuttgart.de' })` ####
- `options {object}` - host, auth, maxResults

If options is a string, the host option will be set to this value. This is deprecated and will be removed in the next major release. Don't do it.

#### `search(type, query, options, callback)` ####
- `type {string}` - all | room | person | event |lecture
- `query {string}` - Your search query
- `options {object}` - maxResults
- `callback {function}` - Called with the search result (error first)  

#### `details(type, id, options, callback)` ####
- `type {string}` - room | person | event | lecture
- `id {number}` - id of the ressource
- `options {object}` - None
- `callback {function}` - Called with the details (error first)

#### `menu(options, callback)` ####
- `options {object}` - None
- `callback {function}` - Called with the menu (error first)

#### `searchDetails(type, query, options, callback)` ####
- `type {string}` - all | room | person | event| lecture
- `query {string}` - Your search query
- `options {object}` - maxResults
- `callback {function}` - Called with the details of all search results (error first)

The client currently does not support authentication. That means that you won't find any students when searching persons.

### Options ###
#### `maxResults {number}` ####
Restricts the number of results that are presented to you. Used for `search` this does not improve performance, for `searchDetails` it does.

#### `host {string}` ####
Uses a custom API host.

#### `auth {object}` ####
Uses Basic Authentication. The object should have the keys 'user' and 'pass' or 'username' and 'password'.

### Running Tests ###

There are three scripts you can use to run tests and analyse the code:

- `npm test`: Runs all the unit tests
- `npm run coverage`: Provides information about the test coverage
- `npm run lint`: Runs JSHint (Rules can be found in `.jshintrc`)
- `npm run jscs`: Runs JSCS (Rules can be found in `.jscsrc`)

## ISC Licence ##

Copyright (c) 2016, Jonas Scheffner

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.