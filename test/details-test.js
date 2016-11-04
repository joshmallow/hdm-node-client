/**
 *
 * Created by Jonas on 04.11.2016.
 */

var expect = require('chai').expect;
var rewire = require('rewire');
var Client = rewire('../');
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();

describe('details', function () {

    afterEach(function () {
        sandbox.restore();
    });

    it('should expose function #details', function () {
        var client = new Client();
        expect(client.details).to.be.a('function');
    });

    it('should make request to get details of person with id 6368845', function (done) {
        var path = 'https://hdmapp.mi.hdm-stuttgart.de/details/anonymous/person/6368845';
        spyDetailsRequest('person', '6368845', path, done);
    });

    it('should make request to get details of person with id 111111', function (done) {
        var path = 'https://hdmapp.mi.hdm-stuttgart.de/details/anonymous/person/111111';
        spyDetailsRequest('person', '111111', path, done);
    });

    it('should make request to get details of lecture with id 111111', function (done) {
        var path = 'https://hdmapp.mi.hdm-stuttgart.de/details/anonymous/lecture/111111';
        spyDetailsRequest('lecture', '111111', path, done);
    });

    it('should make request to get details of event with id 111111', function (done) {
        var path = 'https://hdmapp.mi.hdm-stuttgart.de/details/anonymous/event/111111';
        spyDetailsRequest('event', '111111', path, done);
    });

    it('should make request to get details of event with id 111111', function (done) {
        var path = 'https://hdmapp.mi.hdm-stuttgart.de/details/anonymous/room/123456';
        spyDetailsRequest('room', '123456', path, done);
    });

    it('should not make request if type is invalid', function (done) {
        var spy = sandbox.spy(Client.__get__('request'), 'get');
        client = new Client();
        client.details('test', '123', function () {
            called = spy.called;
            expect(called).to.be.false;
            done();
        })
    });

    it('should provide an error method if type is invalid', function (done) {
        var client = new Client();
        client.details('food', '123', function (err) {
            expect(err.message).to.equal('Type food is invalid.');
            done();
        })
    });

    it('should provide the error if api responds with one', function () {
        var client;
        sandbox.stub(Client.__get__('request'), 'get').callsArgWith(1, 'Test Error', null, null);
        client = new Client();
        client.details('person', '123', function (err) {
            expect(err).to.equal('Test Error');
        })
    });

    it('should provide response body of api call', function () {
        var body, client;
        body = 'Test Body';
        sandbox.stub(Client.__get__('request'), 'get').callsArgWith(1, null, null, body);
        client = new Client();
        client.details('person', '123', function (err, data) {
            expect(data).to.equal(body);
        })
    })
});

function spyDetailsRequest(type, id, path ,done) {
    var called, client, spy;
    spy = sandbox.spy(Client.__get__('request'), 'get');
    client = new Client();
    client.details(type, id, function () {
        called = spy.calledWith(path, sinon.match.typeOf('function'));
        expect(called).to.be.true;
        done();
    })
}