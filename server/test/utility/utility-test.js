'use strict';

const assert = require('assert');
const should = require('should');
const chai = require('chai');

const Utility = require('../../app/modules/utility');

describe('Utility tests', function() {
  it('Builds a token separated object key values by supplying an object', function() {
    const object = {
      'a': 'a',
      'b': 'b',
      'c': 'c'
    };
    assert.equal(Utility.buildDelimiterSeparatedObjectKeys(object, '|'), 'a|b|c');
  });
});
