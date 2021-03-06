import {REPLACE_ME} from './internal';
import {
  objOf, has, keys, values, prop, propOr, path, pathOr, assoc, assocPath,
  dissoc, dissocPath, merge, mergeAll, map, mapObjIndexed, toPairs, fromPairs,
  pick,
  // helpers
  inc,
} from 'ramda';

describe('8. objects', () => {
  describe('objOf', () => {
    it('creates a singleton object', () => {
      objOf('a', 42).should.be.eql({a: 42});
    });
  });

  describe('has', () => {
    it('returns true if the key exists in the object', () => {
      has('a', {a: 42}).should.be.eql(true);
      has('b', {a: 42}).should.be.eql(false);
    });
  });

  describe('keys', () => {
    it('should return a list of all the keys in the object', () => {
      keys({a: 42, 'b': 84}).should.be.eql(['a', 'b']);
    });
  });
  describe('values', () => {
    it('should return a list of all the values in an object', () => {
      values({a: 42, b: 84}).should.be.eql([42, 84]);
    });
  });

  describe('prop', () => {
    it('creates a function to return the value at the given property', () => {
      prop('a', {a: 42}).should.be.eql(42);
    });
    it('is curried', () => {
      prop('a')({'a': 42}).should.be.eql(42);
    });
  });
  describe('propOr', () => {
    it('creates a function to return the value at the given property', () => {
      propOr(42, 'a', {a: 42}).should.be.eql(42);
    });
    it('returns the default value if the given prop doesnt exist', () => {
      propOr('def', 'b', {a: 42}).should.be.eql('def');
    });
    it('is curried', () => {
      propOr(42, 'a', {a: 42}).should.be.eql(42);
      propOr(42)('a', {a: 42}).should.be.eql(42);
      propOr('def', 'a')({a: 42}).should.be.eql(42);
      propOr('def')('a')({a: 42}).should.be.eql(42);
    });
  });

  describe('path', () => {
    it('should get the nested value', () => {
      path(['a', 'b', 'c'], {a: {b: {c: 42}}}).should.be.eql(42);
    });
    it('is curried', () => {
      path(['a', 'b', 'c'])({a: {b: {c: 42}}}).should.be.eql(42);
    });
  });
  describe('pathOr', () => {
    it('should get the nested value', () => {
      pathOr('def', ['a', 'b', 'c'], {a: {b: {c: 42}}})
        .should.be.eql(42);
    });
    it('should return the default value if the path doesnt exist', () => {
      pathOr('def', ['d', 'b', 'c'], {a: {b: {c: 42}}})
        .should.be.eql('def');

      pathOr('def', ['a', 'd', 'c'], {a: {b: {c: 42}}})
        .should.be.eql('def');

      pathOr('def', ['a', 'b', 'd'], {a: {b: {c: 42}}})
        .should.be.eql('def');
    });
    it('should be curried', () => {
      pathOr('def')(['a', 'b', 'c'], {a: {b: {c: 42}}}).should.be.eql(42);
      pathOr('def', ['a', 'b', 'c'])({a: {b: {c: 42}}}).should.be.eql(42);
      pathOr('def')(['a', 'b', 'c'])({a: {b: {c: 42}}}).should.be.eql(42);
    });
  });

  describe('assoc', () => {
    it('should set a value at a given path', () => {
      assoc('key', 'val', {}).should.be.eql({key: 'val'});
    });
  });
  describe('assocPath', () => {
    it('should set a value at a given property', () => {
      assocPath(['key', 'other'], 'val', {})
        .should.be.eql({key: {other: 'val'}});
    });
  });

  describe('dissoc', () => {
    it('should remove the value from the object', () => {
      dissoc('a', {a: 42}).should.be.eql({});
    });
    it('should preserve other associations', () => {
      dissoc('a', {a: 42, b: 84}).should.be.eql({b: 84});
    });
  });
  describe('dissocPath', () => {
    it('should remove the value from the object', () => {
      dissocPath(['a'], {'a': 42}).should.be.eql({});
      dissocPath(['a', 'b'], {a: {b: 42}}).should.be.eql({a: {}});
    });
    it('should preserve other associations', () => {
      dissocPath(['a'], {a: 42, b: 84}).should.be.eql({b: 84});
      dissocPath(['a', 'b'], {a: {b: 42, c: 84}, d: 'e'})
        .should.be.eql({a: {c: 84}, d: 'e'});
    });
  });

  describe('merge', () => {
    it('should combine two objects together', () => {
      merge({a: 'a'}, {b: 'b'}).should.be.eql({a: 'a', b: 'b'});
    });
    it('should preserve the right most value during collisions', () => {
      merge({a: 'a'}, {a: 'b'}).should.be.eql({a: 'b'});
    });
  });
  describe('mergeAll', () => {
    it('should combine a list of objects together', () => {
      mergeAll([{a: 'a'}, {b: 'b'}, {c: 'c'}])
        .should.be.eql({a: 'a', b: 'b', c: 'c'});
    });
    it('should preserve the right most value during collisions', () => {
      mergeAll([{a: 'a'}, {a: 'b'}, {a: 'c'}])
        .should.be.eql({a: 'c'});
    });
  });

  describe('map', () => {
    it('should apply a function to each value', () => {
      map(inc, {a: 1, b: 42})
        .should.be.eql({a: 2, b: 43});
    });
  });
  describe('mapObjIndexed', () => {
    const fn = (value, key, obj) => key + value;
    it('maps a function over each value, and passes the key as well', () => {
      mapObjIndexed(fn, {a: 1, b: 2})
        .should.be.eql({a: 'a1', b: 'b2'});
    });
  });

  describe('toPairs', () => {
    it('converts an object to a list of key value pairs', () => {
      toPairs({a: 1, b: 2}).should.be.eql([['a', 1], ['b', 2]]);
    });
  });
  describe('fromPairs', () => {
    it('constructs an object from a list of pairs', () => {
      fromPairs([['a', 1], ['b', 2]]).should.be.eql({a: 1, b: 2});
    });
  });

  describe('pick', () => {
    it('preserves only the values passed in', () => {
      pick(['a', 'b'], {a: 1, b: 2, c: 3})
        .should.be.eql({a: 1, b: 2});
    });
  });
});
