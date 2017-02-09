const Client = require('../index');
const expect = require('chai').expect;

describe('Client', function () {
    'use strict';

    it('should be a function', function () {
        expect(Client).to.be.a('function');
    });

    it('should set url as specified in the constructor', function () {
        testURL('test.url');
        testURL('http://some.other.test');
        testURL('https://one.more');
    });

    it('should set url as specified', function () {
        testOptions({ host: 'test.url' });
        testOptions({ host: 'http://some.other.test' });
        testOptions({ host: 'https://one.more' });
    });

    it('should set default url when none is specified', function () {
        const client = new Client();
        expect(client.options.host).to.equal('https://hdmapp.mi.hdm-stuttgart.de');
    });

    it('should set default host if options specifies no host', function () {
        const client = new Client({});
        expect(client.options.host).to.equal('https://hdmapp.mi.hdm-stuttgart.de');
    });
});

function testURL(url) {
    'use strict';
    const client = new Client(url);
    expect(client.options.host).to.equal(url);
    expect(client.url).to.equal(url); // for backwards compatibility
}

function testOptions(options) {
    'use strict';
    const client = new Client(options);
    expect(client.options).to.eql(options);
    expect(client.url).to.equal(client.options.host); // for backwards compatibility
}
