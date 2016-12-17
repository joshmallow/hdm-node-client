const expect = require('chai').expect;

describe('module test', function () {
    'use strict';
    it('should find a module in root', function () {
        expect(require.bind(null, '../')).not.to.throw(/Cannot find module/);
    });
});
