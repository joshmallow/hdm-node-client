const Client = require('../');
const expect = require('chai').expect;
const nock = require('nock');

describe('search', function () {
    'use strict';

    afterEach(function () {
        nock.cleanAll();
    });

    it('should expose function #search', function () {
        const client = new Client();
        expect(client.search).to.be.a('function');
    });

    it('should make correct call to search System Engineering lecture', function (done) {
        const path = '/search/anonymous/lectures';
        spySearchRequest('lecture', 'System Engineering', path, done);
    });

    it('should make correct call to search PIA lecture', function (done) {
        const path = '/search/anonymous/lectures';
        spySearchRequest('lecture', 'PIA', path, done);
    });

    it('should make correct call to search person Thomas Pohl ', function (done) {
        const path = '/search/anonymous/persons';
        spySearchRequest('person', 'Thomas Pohl', path, done);
    });

    it('should make correct call to search all types ', function (done) {
        const path = '/search/anonymous/all';
        spySearchRequest('all', 'test', path, done);
    });

    it('should make correct call to search room ', function (done) {
        const path = '/search/anonymous/rooms';
        spySearchRequest('room', 'S106', path, done);
    });

    it('should make correct call to search event ', function (done) {
        const path = '/search/anonymous/events';
        spySearchRequest('event', 'Party', path, done);
    });

    it('should call cb with the parsed api response', function (done) {
        const client = new Client();
        nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get('/search/anonymous/persons')
            .query({ q: 'Pohl' })
            .reply(200, { Test: 'Response' });

        client.search('person', 'Pohl', {}, function (err, data) {
            expect(data).to.be.an('object');
            expect(data).to.eql({ Test: 'Response' });
            done(err, data);
        });
    });

    it('should call cb with the error message if api replies with an error', function (done) {
        const client = new Client();

        nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get('/search/anonymous/persons')
            .query({ q: 'Pohl' })
            .replyWithError('Test Error');

        client.search('person', 'Pohl', {}, function (err) {
            expect(err.message).to.equal('Test Error');
            done();
        });
    });

    it('should not make request if type is invalid', function (done) {
        const scope = nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get(/.*/)
            .query(true)
            .reply('200');

        const client = new Client();
        client.search('food', 'Pohl', {}, function () {
            expect(scope.isDone()).to.equal(false);
            done();
        });
    });

    it('should provide error message if type is invalid', function (done) {
        const  client = new Client();
        client.search('food', 'Pohl', {}, function (err, res) {
            expect(err.message).to.equal('Type food is invalid.');
            expect(res).to.equal(null);
            done();
        });
    });

    it('should provide error if parsing body fails', function (done) {
        nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get(/.*/)
            .query(true)
            .reply('200', 'No JSON');
        const client = new Client();
        client.search('person', 'Pohl', {}, function (err, res) {
            expect(err.name).to.equal('SyntaxError');
            expect(res).to.equal(null);
            done();
        });
    });
});

function spySearchRequest(type, query, path, done) {
    'use strict';

    const scope = nock('https://hdmapp.mi.hdm-stuttgart.de')
        .get(path)
        .query({ q: query })
        .reply(200, { Test: 'Response' });

    const client = new Client();
    client.search(type, query, {}, function () {
        scope.done();
        done();
    });
}
