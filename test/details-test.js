/**
 *
 * Created by Jonas on 04.11.2016.
 */

var expect = require('chai').expect;
var Client = require('../');
var nock = require('nock');

describe('details', function () {

    afterEach(function () {
        nock.cleanAll();
    });

    it('should expose function #details', function () {
        var client = new Client();
        expect(client.details).to.be.a('function');
    });

    it('should make request to get details of person with id 6368845', function (done) {
        var path = '/details/anonymous/person/6368845';
        spyDetailsRequest('person', '6368845', path, done);
    });

    it('should make request to get details of person with id 111111', function (done) {
        var path = '/details/anonymous/person/111111';
        spyDetailsRequest('person', '111111', path, done);
    });

    it('should make request to get details of lecture with id 111111', function (done) {
        var path = '/details/anonymous/lecture/111111';
        spyDetailsRequest('lecture', '111111', path, done);
    });

    it('should make request to get details of event with id 111111', function (done) {
        var path = '/details/anonymous/event/111111';
        spyDetailsRequest('event', '111111', path, done);
    });

    it('should make request to get details of event with id 111111', function (done) {
        var path = '/details/anonymous/room/123456';
        spyDetailsRequest('room', '123456', path, done);
    });

    it('should not make request if type is invalid', function (done) {
        var client, scope;

        scope = nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get(/.*/)
            .query(true)
            .reply('200');

        client = new Client();
        client.details('food', '1221', function () {
            expect(scope.isDone()).to.be.false;
            done();
        })
    });

    it('should provide an error method if type is invalid', function (done) {
        var client = new Client();
        client.details('food', '1234', function (err) {
            expect(err.message).to.equal('Type food is invalid.');
            done();
        })
    });

    it('should provide the error if api responds with one', function (done) {
        var client = new Client();

        nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get('/details/anonymous/person/123')
            .replyWithError('Test Error');

        client.details('person', '123', function (err) {
            expect(err.message).to.equal('Test Error');
            done();
        })
    });

    it('should provide response body of api call as object', function (done) {
        var client = new Client();
        nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get('/details/anonymous/person/123')
            .reply(200, {'Test' : 'Response'});

        client.details('person', '123', function (err, data) {
            expect(data).to.be.an('object');
            expect(data).to.eql({'Test' : 'Response'});
            done(err, data);
        })
    })
});

function spyDetailsRequest(type, id, path ,done) {
    var client, scope;

    scope = nock('https://hdmapp.mi.hdm-stuttgart.de')
        .get(path)
        .reply(200, {Test : 'response'});

    client = new Client();
    client.details(type, id, function () {
        scope.done();
        done();
    })
}