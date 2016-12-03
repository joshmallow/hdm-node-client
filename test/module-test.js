/**
 * Test that the module is loaded correctly
 *
 * Created by Jonas on 02.11.2016.
 */

var expect = require('chai').expect;

describe('module test', function () {
    it('should find a module in root', function () {
        expect(requireModule).not.to.throw(/Cannot find module/);
    });
});

function requireModule() {
    return require('../');
}
