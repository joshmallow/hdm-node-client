var request = require('request');
var urljoin = require('url-join');

var Client = function (url) {
    this.url = !!url ? url : 'https://hdmapp.mi.hdm-stuttgart.de';
};

Client.prototype.search = function (type, query, done) {
    var q, paths;
    paths = {
        person : urljoin(this.url, 'search', 'anonymous', 'persons'),
        lecture: urljoin(this.url, 'search', 'anonymous', 'lectures'),
        all    : urljoin(this.url, 'search', 'anonymous', 'all'),
        room   : urljoin(this.url, 'search', 'anonymous', 'rooms'),
        event  : urljoin(this.url, 'search', 'anonymous', 'events')
    };
    q = encodeURIComponent(query);
    request.get(paths[type] + '?q=' + q, function () {
        done();
    })
};

module.exports = Client;