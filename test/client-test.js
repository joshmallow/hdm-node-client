/**
 * Test the client 'class'
 *
 * Created by Jonas on 03.11.2016.
 */

var Client = require('../lib/client');
var expect = require('chai').expect;

describe('Client', function () {

    it('should be a function', function () {
        expect(Client).to.be.a('function');
    });

    it('should set url as specified in the constructor', function () {
        testURL('test.url');
        testURL('http://some.other.test');
        testURL('https://one.more');
    });

    it('should set default url when none is specified', function () {
        var client = new Client();
        expect(client.url).to.equal('https://hdmapp.mi.hdm-stuttgart.de');
    })
});

function testURL (url) {
    var client = new Client(url);
    expect(client.url).to.equal(url);
}
