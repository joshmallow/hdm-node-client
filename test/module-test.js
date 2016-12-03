const expect = require('chai').expect;

describe('module test', function () {
    it('should find a module in root', function () {
        expect(requireModule).not.to.throw(/Cannot find module/);
    });
});

function requireModule() {
    return require('../');
}
