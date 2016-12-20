const Client = require('../');
const expect = require('chai').expect;
const nock = require('nock');
const utils = require('./utils');

const PERSON_SEARCH_PATH = '/search/anonymous/persons';
const PERSON_DETAILS_PATH = '/details/anonymous/person/';
const client = new Client();

const searchResults = [
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

const details = [
    { personID: 6367009, job: 'Lehrbeauftragter' },
    { personID: 6368845, job: 'Lehrbeauftragter' }
];

describe('searchDetails', function () {
    'use strict';

    beforeEach(function () {
        nock.cleanAll();
    });

    it('should expose function #searchDetails', function () {
        expect(client.searchDetails).to.be.a('function');
    });

    it('should make search', function (done) {
        const scope = nockSuccessfulSearch('thomas', {});

        client.searchDetails('person', 'thomas', {}, function () {
            scope.done();
            done();
        });
    });

    it('should look up details for every search result', function (done) {
        const options = {};
        const searchScope = nockSuccessfulSearch('thomas', searchResults);
        const detailScopes =
            searchResults.map((detail, index) => nockSuccessfulDetails(detail.id));

        client.searchDetails('person', 'thomas', options, function () {
            searchScope.done();
            detailScopes.forEach((scope) => scope.done());
            done();
        });
    });

    it('should call done with error if search request causes one', function (done) {
        nock(client.url)
            .get(PERSON_SEARCH_PATH)
            .query({ q: 'thomas' })
            .replyWithError('Test Error');

        client.searchDetails('person', 'thomas', {}, function (err) {
            expect(err.message).to.equal('Test Error');
            done();
        });
    });

    it('should call done with error if #details throws one', function (done) {
        nockSuccessfulSearch('thomas', searchResults.slice(0, 1));

        nock(client.url)
            .get(PERSON_DETAILS_PATH + searchResults[0].id)
            .replyWithError('Test Error');

        client.searchDetails('person', 'thomas', {}, function (err) {
            expect(err.message).to.equal('Test Error');
            done();
        });
    });

    it('should call done with details', function (done) {
        nockSuccessfulSearch('thomas', searchResults);
        searchResults.forEach(
            (detail, index) => nockSuccessfulDetails(detail.id, details[index]));

        client.searchDetails('person', 'thomas', {}, function (err, res) {
            expect(err).to.equal(null);
            expect(res).to.eql(details);
            done();
        });
    });

    it('should cause no error if maxResults option is used', function (done) {
        nockSuccessfulSearch('thomas', searchResults.slice(0, 1));
        nockSuccessfulDetails('6367009', details[0]);

        client.searchDetails('person', 'thomas', { maxResults: 7 }, function (err) {
            expect(err).to.equal(null);
            done();
        });
    });
});

function nockSuccessfulSearch(query, results) {
    'use strict';
    return utils.nockSuccessfulSearch(nock, client.url, PERSON_SEARCH_PATH, query, results);
}

function nockSuccessfulDetails(id, details) {
    'use strict';
    return utils.nockSuccessfulDetails(nock, client.url, PERSON_DETAILS_PATH + id, details);
}
