var expect = require('chai').expect;
var Client = require('../');
var nock = require('nock');

describe('menu', function () {

    afterEach(function () {
        nock.cleanAll();
    });

    it('should provide function #menu', function () {
        var client = new Client();
        expect(client.menu).to.be.a('function');
    });

    it('make api call', function (done) {
        var client, scope;
        client = new Client();
        scope = nockSuccessfulRequest();

        client.menu(function () {
            scope.done();
            done();
        })
    });

    it('should provide body of api response', function (done) {
        var client = new Client();
        nockSuccessfulRequest();
        client.menu(function (err, body) {
            expect(body).to.equal('Test Body');
            done();
        })
    });

    it('should provide error if api returns one', function (done) {
        var client = new Client();
        nock('https://hdmapp.mi.hdm-stuttgart.de')
            .get('/menu')
            .replyWithError('Test Error');

        client.menu(function (err) {
            expect(err.message).to.equal('Test Error');
            done();
        })
    })
});

function nockSuccessfulRequest() {
    return nock('https://hdmapp.mi.hdm-stuttgart.de')
        .get('/menu')
        .reply(200, 'Test Body');
}