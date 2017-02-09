const expect = require('chai').expect;
const Client = require('../');
const nock = require('nock');
const client = new Client();

describe('menu', function () {
    'use strict';

    afterEach(function () {
        nock.cleanAll();
    });

    it('should provide function #menu', function () {
        expect(client.menu).to.be.a('function');
    });

    it('should make api call', function (done) {
        const scope = nockSuccessfulRequest({ test: 'body' }, client.options.host);
        client.menu({}, function () {
            scope.done();
            done();
        });
    });

    it('should use locally specified host', function (done) {
        const scope = nockSuccessfulRequest({ test: 'body' }, 'https://test.url');
        client.menu({ host: 'https://test.url' }, function () {
            scope.done();
            done();
        });
    });

    it('should provide body of api response as an object', function (done) {
        nockSuccessfulRequest({ test: 'body' }, client.options.host);
        client.menu({}, function (err, body) {
            expect(body).to.be.an('object');
            expect(body).to.eql({ test: 'body' });
            done();
        });
    });

    it('should provide error if api returns one', function (done) {
        nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get('/menu')
            .replyWithError('Test Error');

        client.menu({}, function (err) {
            expect(err.message).to.equal('Test Error');
            done();
        });
    });

    it('should provide error if parsing body fails', function (done) {
        nockSuccessfulRequest('No JSON', client.options.host);
        client.menu({}, function (err, res) {
            expect(err.name).to.equal('SyntaxError');
            expect(res).to.equal(null);
            done();
        });
    });
});

function nockSuccessfulRequest(result, host) {
    'use strict';
    return nock(host)
        .get('/menu')
        .reply(200, result);
}
