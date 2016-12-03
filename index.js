var request = require('request');
var urljoin = require('url-join');
var async   = require('async');
var util = require('util');

var Client = function (url) {
    this.url = url ? url : 'https://hdmapp.mi.hdm-stuttgart.de';
};

Client.prototype.search = function (type, query, done) {
    var q, paths, error;
    paths = {
        person:  urljoin(this.url, 'search', 'anonymous', 'persons'),
        lecture: urljoin(this.url, 'search', 'anonymous', 'lectures'),
        all:     urljoin(this.url, 'search', 'anonymous', 'all'),
        room:    urljoin(this.url, 'search', 'anonymous', 'rooms'),
        event:   urljoin(this.url, 'search', 'anonymous', 'events')
    };
    if (paths.hasOwnProperty(type)) {
        q = encodeURIComponent(query);
        request.get(paths[type] + '?q=' + q, function (err, response, body) {
            if (err) {
                done(err);
                return;
            }

            done(null, JSON.parse(body));
        });
    } else {
        error = new Error('Type ' + type + ' is invalid.');
        done(error, null);
    }
};

Client.prototype.details = function (type, id, done) {
    var validTypes = ['person', 'lecture', 'event', 'room'];
    var path = urljoin(this.url, 'details', 'anonymous', type, id);
    var error;
    if (validTypes.indexOf(type) >= 0) {
        request.get(path, function (err, response, body) {
            if (err) {
                done(err);
                return;
            }

            if (body) {
                done(null, JSON.parse(body));
            } else {
                error = new Error(util.format(
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
    var path = urljoin(this.url, 'menu');
    request.get(path, function (err, response, body) {
        if (err) {
            done(err);
            return;
        }

        done(null, JSON.parse(body));
    });
};

Client.prototype.searchDetails = function (type, query, done) {
    var res = [];
    this.search(type, query, function (err, results) {
        if (err) {
            done(err);
            return;
        }

        async.each(results, function (result, callback) {
            this.details(result.type, result.id, function (err, det) {
                res.push(det);
                callback(err);
            });
        }.bind(this), function (err) {
            done(err, res);
        });
    }.bind(this));
};

module.exports = Client;
