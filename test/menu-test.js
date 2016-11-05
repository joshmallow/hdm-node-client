var expect = require('chai').expect;
var Client = require('../');

describe('menu', function () {
    it('should provide function #menu', function () {
        var client = new Client();
        expect(client.menu).to.be.a('function');
    })
});