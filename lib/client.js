var request = require('request');
var urljoin = require('url-join');

var Client = function (url) {
    this.url = !!url ? url : 'https://hdmapp.mi.hdm-stuttgart.de';
};

Client.prototype.search = function (type, query, done) {
    var q, paths, error;
    paths = {
        person : urljoin(this.url, 'search', 'anonymous', 'persons'),
        lecture: urljoin(this.url, 'search', 'anonymous', 'lectures'),
        all    : urljoin(this.url, 'search', 'anonymous', 'all'),
        room   : urljoin(this.url, 'search', 'anonymous', 'rooms'),
        event  : urljoin(this.url, 'search', 'anonymous', 'events')
    };
    if (paths.hasOwnProperty(type)) {
        q = encodeURIComponent(query);
        request.get(paths[type] + '?q=' + q, function (err, response, body) {
            done(err, body);
        })
    } else {
        error = new Error('Type ' + type + ' is invalid.');
        done(error, null);
    }
};

Client.prototype.details = function () {

};

module.exports = Client;