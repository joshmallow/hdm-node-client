var Client = require('../');
var expect = require('chai').expect;

describe('searchDetails', function () {
    it('should expose function #searchDetails', function () {
        var client = new Client();
        expect(client.searchDetails).to.be.a('function');
    });
});