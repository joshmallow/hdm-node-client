/**
 *
 * Created by Jonas on 04.11.2016.
 */

var expect = require('chai').expect;
var Client = require('../');

describe('details', function () {

    it('should expose function #details', function () {
        var client = new Client();
        expect(client.details).to.be.a('function');
    })

});