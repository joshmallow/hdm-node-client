var Client = require('../');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();

describe('searchDetails', function () {

    beforeEach(function() {
       sandbox.restore();
    });

    it('should expose function #searchDetails', function () {
        var client = new Client();
        expect(client.searchDetails).to.be.a('function');
    });

    it('should call #search', function (done) {
        var client = new Client();

        client.search = function(type, query, cb) {
            expect(type).to.equal('person');
            expect(query).to.equal('thomas');
            expect(cb).to.be.a('function');
            done();
        };

        client.searchDetails('person', 'thomas');
    });

    it('should call details for every search result', function (done) {
        var client, mock;
        client = new Client();
        mock =sandbox.mock(client).expects('details')
            .twice()
            .callsArgWith(2, null, 'test detail');
        client.search = sandbox.stub().callsArgWith(2, null, searchDetails);

        client.searchDetails('person', 'thomas', function (err) {
            mock.verify();
            done(err);
        })
    });

    it('should call done with error if #search throws one', function(done) {
        var client = new Client();
        client.search = sandbox.stub().callsArgWith(2, 'Test Error', null);

        client.searchDetails('person', 'thomas', function (err) {
            expect(err).to.equal('Test Error');
            done();
        })
    });

    it('should call done with error if #details throws one', function(done) {
        var client;
        client = new Client();
        sandbox.stub(client,'search').callsArgWith(2, null, searchDetails);
        sandbox.stub(client, 'details').callsArgWith(2, 'Test Error', null);

        client.searchDetails('person', 'thomas', function (err) {
            expect(err).to.equal('Test Error');
            done();
        })
    });
});

var searchDetails = [
    {
        "id":    6367009,
        "title": "Thomas Wieland",
        "info":  "wieland",
        "type":  "person"
    },
    {
        "id":    6368845,
        "title": "Thomas Pohl",
        "info":  "pohlt",
        "type":  "person"
    }
];