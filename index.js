'use strict';

const request = require('request');
const urljoin = require('url-join');
const async   = require('async');
const util    = require('util');
const _       = require('lodash');

class Client {

    constructor(options) {

        const defaultHost = 'https://hdmapp.mi.hdm-stuttgart.de';

        if (_.isString(options)) {    // for backwards compatibility
            this.options = { host: options };
        } else if (options) {
            this.options = options;
            this.options.host = this.options.host || defaultHost;
        } else {
            this.options = { host:  defaultHost };
        }

        this.url = this.options.host; // for backwards compatibility
    }

    search(type, query, options, done) {
        options = Object.assign({}, this.options, options);
        const paths = {
            person:  urljoin(options.host, 'search', 'anonymous', 'persons'),
            lecture: urljoin(options.host, 'search', 'anonymous', 'lectures'),
            all:     urljoin(options.host, 'search', 'anonymous', 'all'),
            room:    urljoin(options.host, 'search', 'anonymous', 'rooms'),
            event:   urljoin(options.host, 'search', 'anonymous', 'events')
        };

        if (!paths.hasOwnProperty(type)) {
            done(new Error(`Type ${type} is invalid.`), null);
            return;
        }

        const q = encodeURIComponent(query);
        async.waterfall([
            (cb) => request.get(paths[type] + '?q=' + q, cb),
            (res, body, cb) => provideResponse(body, options, this.options, cb)
        ], done);
    }

    details(type, id, options, done) {
        options = Object.assign({}, this.options, options);
        const validTypes = ['person', 'lecture', 'event', 'room'];
        if (!_.includes(validTypes, type)) {
            done(new Error(`Type ${type} is invalid.`), null);
            return;
        }

        const path = urljoin(options.host, 'details', 'anonymous', type, id);

        async.waterfall([
            (cb) => request.get(path, cb),
            (res, body, cb) => provideResponse(body, options, this.options, cb, () => {
                const msg = `The API could not provide details for a ${type} with the id ${id}`;
                done(new Error(msg), null);
            })
        ], done);
    }

    menu(options, done) {
        options = Object.assign({}, this.options, options);
        const path = urljoin(options.host, 'menu');
        async.waterfall([
            (cb) => request.get(path, cb),
            (res, body, cb) => provideResponse(body, options, this.options, cb)
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

function provideResponse(body, localOptions, globalOptions, done, onMissingBody) {
    if (onMissingBody && !body) {
        return onMissingBody();
    }

    try {
        done(null, applyOptions(JSON.parse(body), localOptions, globalOptions));
    } catch (error) {
        done(error, null);
    }
}

function applyOptions(body, localOptions, globalOptions) {
    const options = Object.assign({}, globalOptions, localOptions);
    return Array.isArray(body) && options.maxResults ? body.slice(0, options.maxResults) : body;
}

module.exports = Client;
