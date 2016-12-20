const Client = require('../');
const expect = require('chai').expect;
const nock = require('nock');
const urljoin = require('url-join');
const utils = require('./utils');
const client = new Client();
const paths = {};

describe('search', function () {
    'use strict';

    before(function () {
        const keys = ['lectures', 'persons', 'all', 'rooms', 'events'];
        keys.forEach((type) => paths[type] = urljoin('/search', 'anonymous', type));
    });

    afterEach(function () {
        nock.cleanAll();
    });

    it('should expose function #search', function () {
        expect(client.search).to.be.a('function');
    });

    it('should make correct call to search System Engineering lecture', function (done) {
        spySearchRequest('lecture', 'System Engineering', paths.lectures, done);
    });

    it('should make correct call to search PIA lecture', function (done) {
        spySearchRequest('lecture', 'PIA', paths.lectures, done);
    });

    it('should make correct call to search person Thomas Pohl ', function (done) {
        spySearchRequest('person', 'Thomas Pohl', paths.persons, done);
    });

    it('should make correct call to search all types ', function (done) {
        spySearchRequest('all', 'test', paths.all, done);
    });

    it('should make correct call to search room ', function (done) {
        spySearchRequest('room', 'S106', paths.rooms, done);
    });

    it('should make correct call to search event ', function (done) {
        spySearchRequest('event', 'Party', paths.events, done);
    });

    it('should call cb with the parsed api response', function (done) {
        nockSuccessfulSearch(paths.persons, 'Pohl', { Test: 'Response' });

        client.search('person', 'Pohl', {}, function (err, data) {
            expect(data).to.be.an('object');
            expect(data).to.eql({ Test: 'Response' });
            done(err, data);
        });
    });

    it('should call cb with the error message if api replies with an error', function (done) {
        nock(client.url)
            .get(paths.persons)
            .query({ q: 'Pohl' })
            .replyWithError('Test Error');

        client.search('person', 'Pohl', {}, function (err) {
            expect(err.message).to.equal('Test Error');
            done();
        });
    });

    it('should not make request if type is invalid', function (done) {
        const scope = nockSuccessfulSearch(/.*/, true, {});

        client.search('food', 'Pohl', {}, function () {
            expect(scope.isDone()).to.equal(false);
            done();
        });
    });

    it('should provide error message if type is invalid', function (done) {
        client.search('food', 'Pohl', {}, function (err, res) {
            expect(err.message).to.equal('Type food is invalid.');
            expect(res).to.equal(null);
            done();
        });
    });

    it('should limit results if maxResults option is set', function (done) {
        const result = ['one', 'two', 'three', 'four', 'five'];
        const options = { maxResults: 3 };
        nockSuccessfulSearch(paths.persons, 'Pohl', result);
        client.search('person', 'Pohl', options, function (err, res) {
            expect(err).to.equal(null);
            expect(res.length).to.equal(3);
            done();
        });
    });

    it('should provide error if parsing body fails', function (done) {
        nockSuccessfulSearch(paths.persons, 'Pohl', 'No JSON');
        client.search('person', 'Pohl', {}, function (err, res) {
            expect(err.name).to.equal('SyntaxError');
            expect(res).to.equal(null);
            done();
        });
    });
});

function spySearchRequest(type, query, path, done) {
    'use strict';

    const scope = nockSuccessfulSearch(path, query, {});
    client.search(type, query, {}, function () {
        scope.done();
        done();
    });
}

function nockSuccessfulSearch(path, query, result) {
    'use strict';
    return utils.nockSuccessfulSearch(nock, client.url, path, query, result);
}
