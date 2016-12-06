const Client = require('../');
const expect = require('chai').expect;
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();

const searchDetails = [
    {
        id:    6367009,
        title: 'Thomas Wieland',
        info:  'wieland',
        type:  'person'
    },
    {
        id:    6368845,
        title: 'Thomas Pohl',
        info:  'pohlt',
        type:  'person'
    }
];

describe('searchDetails', function () {
    'use strict';

    beforeEach(function () {
        sandbox.restore();
    });

    it('should expose function #searchDetails', function () {
        const client = new Client();
        expect(client.searchDetails).to.be.a('function');
    });

    it('should call #search', function (done) {
        const client = new Client();

        client.search = function (type, query, cb) {
            expect(type).to.equal('person');
            expect(query).to.equal('thomas');
            expect(cb).to.be.a('function');
            done();
        };

        client.searchDetails('person', 'thomas');
    });

    it('should call details for every search result', function (done) {
        const client = new Client();
        const mock = sandbox.mock(client).expects('details')
            .twice()
            .callsArgWith(2, null, 'test detail');
        client.search = sandbox.stub().callsArgWith(2, null, searchDetails);

        client.searchDetails('person', 'thomas', function (err) {
            mock.verify();
            done(err);
        });
    });

    it('should call done with error if #search throws one', function (done) {
        const client = new Client();
        client.search = sandbox.stub().callsArgWith(2, 'Test Error', null);

        client.searchDetails('person', 'thomas', function (err) {
            expect(err).to.equal('Test Error');
            done();
        });
    });

    it('should call done with error if #details throws one', function (done) {
        const client = new Client();
        sandbox.stub(client, 'search').callsArgWith(2, null, searchDetails);
        sandbox.stub(client, 'details').callsArgWith(2, 'Test Error', null);

        client.searchDetails('person', 'thomas', function (err) {
            expect(err).to.equal('Test Error');
            done();
        });
    });

    it('should call done with details', function (done) {
        const client = new Client();
        sandbox.stub(client, 'search').callsArgWith(2, null, searchDetails);
        sandbox.stub(client, 'details').callsArgWith(2, null, 'Test Result');

        client.searchDetails('person', 'thomas', function (err, res) {
            expect(err).to.equal(null);
            expect(res).to.eql(['Test Result', 'Test Result']);
            done();
        });
    });
});

