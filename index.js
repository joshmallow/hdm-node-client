const request = require('request');
const urljoin = require('url-join');
const async   = require('async');
const util = require('util');

const Client = function (url) {
    this.url = url ? url : 'https://hdmapp.mi.hdm-stuttgart.de';
};

Client.prototype.search = function (type, query, done) {
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
            if (err) {
                done(err);
                return;
            }

            try {
                done(null, JSON.parse(body));
            } catch (error) {
                done(error, null);
            }
        });
    } else {
        const error = new Error('Type ' + type + ' is invalid.');
        done(error, null);
    }
};

Client.prototype.details = function (type, id, done) {
    const validTypes = ['person', 'lecture', 'event', 'room'];
    if (validTypes.indexOf(type) >= 0) {
        const path = urljoin(this.url, 'details', 'anonymous', type, id);
        request.get(path, function (err, response, body) {
            if (err) {
                done(err);
                return;
            }

            if (body) {
                done(null, JSON.parse(body));
            } else {
                const error = new Error(util.format(
                    'The API could not provide details for a %s with the id %s',
                    type, id));
                done(error, null);
            }
        });
    } else {
        done(new Error('Type ' + type + ' is invalid.'));
    }

};

Client.prototype.menu = function (done) {
    const path = urljoin(this.url, 'menu');
    request.get(path, function (err, response, body) {
        if (err) {
            done(err);
            return;
        }

        done(null, JSON.parse(body));
    });
};

Client.prototype.searchDetails = function (type, query, done) {
    this.search(type, query, (err, results) => {
        if (err) {
            done(err);
            return;
        }

        const res = [];
        async.each(results, (result, callback) => {
            this.details(result.type, result.id, function (err, det) {
                res.push(det);
                callback(err);
            });
        }, function (err) {
            done(err, res);
        });
    });
};

module.exports = Client;
