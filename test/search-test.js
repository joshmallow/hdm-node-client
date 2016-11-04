/**
 *
 * Created by Jonas on 03.11.2016.
 */
var rewire = require('rewire');
var sinon = require('sinon');
var Client = rewire('../');
var expect = require('chai').expect;
var sandbox = sinon.sandbox.create();

describe('search', function () {

    beforeEach(function () {
        sandbox.restore();
    });

    it('should expose function #search', function () {
        var client = new Client();
        expect(client.search).to.be.a('function');
    });

    it('should make correct call to search System Engineering lecture', function (done) {
        var path = 'https://hdmapp.mi.hdm-stuttgart.de/search/anonymous/lectures?q=System%20Engineering';
        spySearchRequest('lecture', 'System Engineering', path, done);
    });

    it('should make correct call to search PIA lecture', function (done) {
        var path = 'https://hdmapp.mi.hdm-stuttgart.de/search/anonymous/lectures?q=PIA';
        spySearchRequest('lecture', 'PIA', path, done);
    });

    it('should make correct call to search person Thomas Pohl ', function (done) {
        var path = 'https://hdmapp.mi.hdm-stuttgart.de/search/anonymous/persons?q=Thomas%20Pohl';
        spySearchRequest('person', 'Thomas Pohl', path, done);
    });

    it('should make correct call to search all types ', function (done) {
        var path = 'https://hdmapp.mi.hdm-stuttgart.de/search/anonymous/all?q=test';
        spySearchRequest('all', 'test', path, done);
    });

    it('should make correct call to search room ', function (done) {
        var path = 'https://hdmapp.mi.hdm-stuttgart.de/search/anonymous/rooms?q=S106';
        spySearchRequest('room', 'S106', path, done);
    });

    it('should make correct call to search event ', function (done) {
        var path = 'https://hdmapp.mi.hdm-stuttgart.de/search/anonymous/events?q=Party';
        spySearchRequest('event', 'Party', path, done);
    });

    it('should call cb with the api response as is', function (done) {
        var testdata, client;
        testdata = 'test data';
        sandbox.stub(Client.__get__('request'), 'get').callsArgWith(1, null, null, testdata);
        client = new Client();
        client.search('person', 'Pohl', function (err, data) {
            expect(data).to.equal(testdata);
            done(err, data);
        })
    });

    it('should call cb with the error message if api replies with an error', function (done) {
        var client;
        sandbox.stub(Client.__get__('request'), 'get').callsArgWith(1, 'Test Error', null, null);
        client = new Client();
        client.search('person', 'Pohl', function (err) {
            expect(err).to.equal('Test Error');
            done();
        })
    });

    it('should not make request if type is invalid', function (done) {
        var client, spy, called;

        spy = sandbox.spy(Client.__get__('request'), 'get');
        client = new Client();
        client.search('food', 'Pohl', function () {
            called = spy.called;
            expect(called).to.be.false;
            done();
        })
    });

    it('should provide error message if type is invalid', function (done) {
        var client = new Client();
        client.search('food', 'Pohl', function (err) {
            expect(err.message).to.equal('Type food is invalid.');
            done();
        })
    })

});

function spySearchRequest (type, query, path, done) {
    var spy, client, called;
    spy    = sandbox.spy(Client.__get__('request'), 'get');
    client = new Client();
    client.search(type, query, function () {
        called = spy.calledWith(path, sinon.match.typeOf('function'));
        expect(called).to.be.true;
        done();
    })
}
