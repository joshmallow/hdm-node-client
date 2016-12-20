const request = require('request');
const urljoin = require('url-join');
const async   = require('async');
const util = require('util');

const Client = function (url) {
    'use strict';
    this.url = url ? url : 'https://hdmapp.mi.hdm-stuttgart.de';
};

Client.prototype.search = function (type, query, options, done) {
    'use strict';
    const paths = {
        person:  urljoin(this.url, 'search', 'anonymous', 'persons'),
        lecture: urljoin(this.url, 'search', 'anonymous', 'lectures'),
        all:     urljoin(this.url, 'search', 'anonymous', 'all'),
        room:    urljoin(this.url, 'search', 'anonymous', 'rooms'),
        event:   urljoin(this.url, 'search', 'anonymous', 'events')
    };
    if (paths.hasOwnProperty(type)) {
        const q = encodeURIComponent(query);
        request.get(paths[type] + '?q=' + q, function (err, response, body) {
            provideResponse(err, body, options, done);
        });
    } else {
        done(new Error('Type ' + type + ' is invalid.'), null);
    }
};

Client.prototype.details = function (type, id, options, done) {
    'use strict';
    const validTypes = ['person', 'lecture', 'event', 'room'];
    if (validTypes.indexOf(type) >= 0) {
        const path = urljoin(this.url, 'details', 'anonymous', type, id);
        request.get(path, function (err, response, body) {
            provideResponse(err, body, {}, done, function () {
                const error = new Error(util.format(
                    'The API could not provide details for a %s with the id %s',
                    type, id));
                done(error, null);
            });
        });
    } else {
        done(new Error('Type ' + type + ' is invalid.'), null);
    }

};

Client.prototype.menu = function (options, done) {
    'use strict';
    const path = urljoin(this.url, 'menu');
    request.get(path, function (err, response, body) {
        provideResponse(err, body, {}, done);
    });
};

Client.prototype.searchDetails = function (type, query, options, done) {
    'use strict';
    this.search(type, query, options, (err, results) => {
        if (err) {
            done(err);
            return;
        }

        const res = [];
        async.each(results, (result, callback) => {
            this.details(result.type, result.id, options, function (err, det) {
                res.push(det);
                callback(err);
            });
        }, function (err) {
            done(err, res);
        });
    });
};

function provideResponse(err, body, options, done, onMissingBody) {
    'use strict';
    if (err) {
        done(err);
        return;
    }

    if (onMissingBody && !body) {
        onMissingBody();
    } else {
        try {
            done(null, applyOptions(JSON.parse(body), options));
        } catch (error) {
            done(error, null);
        }
    }
}

function applyOptions(body, options) {
    'use strict';

    return Array.isArray(body) && options.maxResults ? body.slice(0, options.maxResults) : body;
}

module.exports = Client;
