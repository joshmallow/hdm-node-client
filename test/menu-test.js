const expect = require('chai').expect;
const Client = require('../');
const nock = require('nock');

describe('menu', function () {

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
});

function nockSuccessfulRequest() {
    return nock('https://hdmapp.mi.hdm-stuttgart.de')
        .get('/menu')
        .reply(200, { test: 'body' });
}
