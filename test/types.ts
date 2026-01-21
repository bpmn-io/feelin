import {
  evaluate,
  unaryTest
} from '..';

import { expect } from 'chai';


describe('types', function() {

  describe('evaluate', function() {

    it('should evaluate', function() {

      // when
      const result = evaluate('hello', {
        hello: 'HELLO'
      });

      // then
      expect(result.value).to.eql('HELLO');
      expect(result.warnings).to.be.an('array');
    });

  });


  describe('unaryTest', function() {

    it('should test', function() {

      // when
      const result = unaryTest('[10, 20]', {
        '?': 5
      });

      // then
      expect(result.value).to.be.false;
      expect(result.warnings).to.be.an('array');
    });

  });

});