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

Client.prototype.details = function (type, id, done) {
    var validTypes = ['person', 'lecture', 'event', 'room'];
    var path = urljoin(this.url, 'details', 'anonymous', type, id);
    if (validTypes.indexOf(type) >= 0){
        request.get(path, function (err, response, body) {
            done(err, body);
        })
    } else {
        done(new Error('Type ' + type + ' is invalid.'));
    }

};

module.exports = Client;