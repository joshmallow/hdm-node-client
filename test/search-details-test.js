/**
 *
 * Created by Jonas on 04.11.2016.
 */

var Client = require('../');
var expect = require('chai').expect;

describe('search details', function () {
    it('should provide function #searchDetails', function () {
        var client = new Client();
        expect(client.searchDetails).to.be.a('function');
    });
});