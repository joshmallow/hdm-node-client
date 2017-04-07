'use strict';

const request = require('request');
const urljoin = require('url-join');
const async   = require('async');
const util    = require('util');
const _       = require('lodash');

class Client {

    constructor(options) {
        this.options = completeOptions(options);

        // for backwards compatibility
        this.url = this.options.host;
    }

    search(type, query, options, done) {
        options = Object.assign({}, this.options, options);
        const searchPath = options.auth ? 'search' : 'search/anonymous';
        const paths = {
            person:  urljoin(options.host, searchPath, 'persons'),
            lecture: urljoin(options.host, searchPath, 'lectures'),
            all:     urljoin(options.host, searchPath, 'all'),
            room:    urljoin(options.host, searchPath, 'rooms'),
            event:   urljoin(options.host, searchPath, 'events')
        };

        if (!paths.hasOwnProperty(type)) {
            done(new Error(`Type ${type} is invalid.`), null);
            return;
        }

        const reqOptions = { auth: options.auth };
        const q = encodeURIComponent(query);
        async.waterfall([
            (cb) => request.get(paths[type] + '?q=' + q, reqOptions, cb),
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

        const path = urljoin(options.host, 'details', type, id);

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
    return _.isArray(body) && options.maxResults ? body.slice(0, options.maxResults) : body;
}

function completeOptions(options) {
    const defaultOptions = { host: 'https://hdmapp.mi.hdm-stuttgart.de' };
    let completedOptions;

    if (_.isString(options)) {
        // for backwards compatibility
        completedOptions = { host: options };
    } else {
        completedOptions = Object.assign({}, defaultOptions, options);
    }

    return completedOptions;
}

module.exports = Client;
