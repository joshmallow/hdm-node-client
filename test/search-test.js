var Client = require('../');
var expect = require('chai').expect;
var nock = require('nock');

describe('search', function () {

    afterEach(function () {
        nock.cleanAll();
    });

    it('should expose function #search', function () {
        var client = new Client();
        expect(client.search).to.be.a('function');
    });

    it('should make correct call to search System Engineering lecture', function (done) {
        var path = '/search/anonymous/lectures';
        spySearchRequest('lecture', 'System Engineering', path, done);
    });

    it('should make correct call to search PIA lecture', function (done) {
        var path = '/search/anonymous/lectures';
        spySearchRequest('lecture', 'PIA', path, done);
    });

    it('should make correct call to search person Thomas Pohl ', function (done) {
        var path = '/search/anonymous/persons';
        spySearchRequest('person', 'Thomas Pohl', path, done);
    });

    it('should make correct call to search all types ', function (done) {
        var path = '/search/anonymous/all';
        spySearchRequest('all', 'test', path, done);
    });

    it('should make correct call to search room ', function (done) {
        var path = '/search/anonymous/rooms';
        spySearchRequest('room', 'S106', path, done);
    });

    it('should make correct call to search event ', function (done) {
        var path = '/search/anonymous/events';
        spySearchRequest('event', 'Party', path, done);
    });

    it('should call cb with the parsed api response', function (done) {
        var client = new Client();
        nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get('/search/anonymous/persons')
            .query({ q: 'Pohl' })
            .reply(200, { Test: 'Response' });

        client.search('person', 'Pohl', function (err, data) {
            expect(data).to.be.an('object');
            expect(data).to.eql({ Test: 'Response' });
            done(err, data);
        });
    });

    it('should call cb with the error message if api replies with an error', function (done) {
        var client = new Client();

        nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get('/search/anonymous/persons')
            .query({ q: 'Pohl' })
            .replyWithError('Test Error');

        client.search('person', 'Pohl', function (err) {
            expect(err.message).to.equal('Test Error');
            done();
        });
    });

    it('should not make request if type is invalid', function (done) {
        var client, scope;

        scope = nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get(/.*/)
            .query(true)
            .reply('200');

        client = new Client();
        client.search('food', 'Pohl', function () {
            expect(scope.isDone()).to.be.false;
            done();
        });
    });

    it('should provide error message if type is invalid', function (done) {
        var client = new Client();
        client.search('food', 'Pohl', function (err) {
            expect(err.message).to.equal('Type food is invalid.');
            done();
        });
    });
});

function spySearchRequest(type, query, path, done) {
    var client, scope;

    scope = nock('https://hdmapp.mi.hdm-stuttgart.de')
        .get(path)
        .query({ q: query })
        .reply(200, { Test: 'Response' });

    client = new Client();
    client.search(type, query, function () {
        scope.done();
        done();
    });
}
