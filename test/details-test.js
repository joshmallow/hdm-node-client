const expect = require('chai').expect;
const Client = require('../');
const nock = require('nock');
const utils = require('./utils');
const urljoin = require('url-join');

const client = new Client();
const personDetailsPath = '/details/anonymous/';
const defaultHost = 'https://hdmapp.mi.hdm-stuttgart.de';

describe('details', function () {
    'use strict';

    afterEach(function () {
        nock.cleanAll();
    });

    it('should expose function #details', function () {
        expect(client.details).to.be.a('function');
    });

    it('should make request to get details of person with id 6368845', function (done) {
        const path = '/details/anonymous/person/6368845';
        spyDetailsRequest('person', '6368845', defaultHost, path, {}, done);
    });

    it('should make request to get details of person with id 111111', function (done) {
        const path = '/details/anonymous/person/111111';
        spyDetailsRequest('person', '111111', defaultHost, path, {}, done);
    });

    it('should make request to get details of lecture with id 111111', function (done) {
        const path = '/details/anonymous/lecture/111111';
        spyDetailsRequest('lecture', '111111', defaultHost, path, {}, done);
    });

    it('should make request to get details of event with id 111111', function (done) {
        const path = '/details/anonymous/event/111111';
        spyDetailsRequest('event', '111111', defaultHost, path, {}, done);
    });

    it('should make request to get details of event with id 123456', function (done) {
        const path = '/details/anonymous/room/123456';
        spyDetailsRequest('room', '123456', defaultHost, path, {}, done);
    });

    it('should use locally specified host', function (done) {
        const host = 'https://some.url';
        const path = '/details/anonymous/room/123456';
        spyDetailsRequest('room', '123456', host, path, { host: host }, done);
    });

    it('should not make request if type is invalid', function (done) {

        const scope = nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get(/.*/)
            .query(true)
            .reply('200');

        client.details('food', '1221', {}, function () {
            expect(scope.isDone()).to.equal(false);
            done();
        });
    });

    it('should provide an error method if type is invalid', function (done) {
        client.details('food', '1234', {}, function (err, response) {
            expect(err.message).to.equal('Type food is invalid.');
            expect(response).to.equal(null);
            done();
        });
    });

    it('should provide the error if api responds with one', function (done) {
        nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get('/details/anonymous/person/123')
            .replyWithError('Test Error');

        client.details('person', '123', {}, function (err) {
            expect(err.message).to.equal('Test Error');
            done();
        });
    });

    describe('handling missing body', function () {

        function testReactionToEmptyResponse(type, id, done) {
            nockSuccessfulDetails(id, type, undefined);

            client.details(type, id, {}, function (err) {
                expect(err.message).to.equal('The API could not provide details ' +
                    'for a ' + type + ' with the id ' + id);
                done();
            });
        }

        it('should provide an error if no person is found', function (done) {
            testReactionToEmptyResponse('person', 108, done);
        });

        it('should provide an error if no lecture is found', function (done) {
            testReactionToEmptyResponse('lecture', 123, done);
        });

        it('should provide an error if no event is found', function (done) {
            testReactionToEmptyResponse('event', 11111, done);
        });

        it('should provide an error if no room is found', function (done) {
            testReactionToEmptyResponse('room', 11111, done);
        });
    });

    it('should provide response body of api call as object', function (done) {
        const details = { Test: 'Response' };
        nockSuccessfulDetails('123', 'person', details);

        client.details('person', '123', {}, function (err, data) {
            expect(err).to.equal(null);
            expect(data).to.be.an('object');
            expect(data).to.eql(details);
            done();
        });
    });

    it('should provide error if parsing body fails', function (done) {
        nockSuccessfulDetails(123, 'person', 'No JSON');
        client.details('person', '123', {}, function (err, res) {
            expect(err.name).to.equal('SyntaxError');
            expect(res).to.equal(null);
            done();
        });
    });
});

function spyDetailsRequest(type, id, host, path, options, done) {
    'use strict';

    const scope = nock(host)
        .get(path)
        .reply(200, { Test: 'response' });

    client.details(type, id, options, function () {
        scope.done();
        done();
    });
}

function nockSuccessfulDetails(id, type, details) {
    'use strict';
    const path = urljoin(personDetailsPath, type, id);
    return utils.nockSuccessfulDetails(nock, client.options.host, path, details);
}
