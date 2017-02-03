'use strict';

const request = require('request');
const urljoin = require('url-join');
const async   = require('async');
const util    = require('util');

class Client {

    constructor(url) {
        this.url = url ? url : 'https://hdmapp.mi.hdm-stuttgart.de';
    }

    search(type, query, options, done) {
        const paths = {
            person: urljoin(this.url, 'search', 'anonymous', 'persons'),
            lecture: urljoin(this.url, 'search', 'anonymous', 'lectures'),
            all: urljoin(this.url, 'search', 'anonymous', 'all'),
            room: urljoin(this.url, 'search', 'anonymous', 'rooms'),
            event: urljoin(this.url, 'search', 'anonymous', 'events')
        };

        if (!paths.hasOwnProperty(type)) {
            done(new Error(`Type ${type} is invalid.`), null);
            return;
        }

        const q = encodeURIComponent(query);
        async.waterfall([
            (cb) => request.get(paths[type] + '?q=' + q, cb),
            (res, body, cb) => provideResponse(body, options, cb)
        ], done);
    }

    details(type, id, options, done) {
        const validTypes = ['person', 'lecture', 'event', 'room'];
        if (validTypes.indexOf(type) < 0) {
            done(new Error(`Type ${type} is invalid.`), null);
            return;
        }

        const path = urljoin(this.url, 'details', 'anonymous', type, id);

        async.waterfall([
            (cb) => request.get(path, cb),
            (res, body, cb) => provideResponse(body, options, cb, () => {
                const msg = `The API could not provide details for a ${type} with the id ${id}`;
                done(new Error(msg), null);
            })
        ], done);
    }

    menu(options, done) {
        const path = urljoin(this.url, 'menu');
        async.waterfall([
            (cb) => request.get(path, cb),
            (res, body, cb) => provideResponse(body, options, cb)
        ], done);
    }

    searchDetails(type, query, options, done) {
        async.waterfall([
            (cb) => this.search(type, query, options, cb),
            (results, cb) =>
                async.map(results, (res, cb) => this.details(res.type, res.id, options, cb), cb)
        ], done);
    }
}

function provideResponse(body, options, done, onMissingBody) {
    if (onMissingBody && !body) {
        return onMissingBody();
    }

    try {
        done(null, applyOptions(JSON.parse(body), options));
    } catch (error) {
        done(error, null);
    }
}

function applyOptions(body, options) {
    return Array.isArray(body) && options.maxResults ? body.slice(0, options.maxResults) : body;
}

module.exports = Client;
