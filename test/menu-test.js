const expect = require('chai').expect;
const Client = require('../');
const nock = require('nock');

describe('menu', function () {
    'use strict';

    afterEach(function () {
        nock.cleanAll();
    });

    it('should provide function #menu', function () {
        const client = new Client();
        expect(client.menu).to.be.a('function');
    });

    it('make api call', function (done) {
        const scope = nockSuccessfulRequest();
        const client = new Client();

        client.menu(function () {
            scope.done();
            done();
        });
    });

    it('should provide body of api response as an object', function (done) {
        nockSuccessfulRequest();
        const client = new Client();
        client.menu(function (err, body) {
            expect(body).to.be.an('object');
            expect(body).to.eql({ test: 'body' });
            done();
        });
    });

    it('should provide error if api returns one', function (done) {
        nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get('/menu')
            .replyWithError('Test Error');

        const client = new Client();
        client.menu(function (err) {
            expect(err.message).to.equal('Test Error');
            done();
        });
    });

    it('should provide error if parsing body fails', function (done) {
        nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get('/menu')
            .query(true)
            .reply('200', 'No JSON');
        const client = new Client();
        client.menu(function (err, res) {
            expect(err.name).to.equal('SyntaxError');
            expect(res).to.equal(null);
            done();
        });
    });
});

function nockSuccessfulRequest() {
    'use strict';
    return nock('https://hdmapp.mi.hdm-stuttgart.de')
        .get('/menu')
        .reply(200, { test: 'body' });
}
