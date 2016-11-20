var Client = require('../');
var expect = require('chai').expect;
var sinon = require('sinon');
var sandbox = sinon.sandbox.create();

describe('searchDetails', function () {


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
        var client = new Client(), mock;
        mock =sandbox.mock(client).expects('details')
            .twice()
            .callsArgWith(2, null, 'test detail');
        client.search = sandbox.stub().callsArgWith(2, null, [
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
        ]);

        client.searchDetails('person', 'thomas', function (err) {
            mock.verify();
            done(err);
        })
    })
});