const objUtils = require('../../../../src/api/v1/utils/objUtils');

/* eslint-disable no-undef */

test('Test is empty object', () => {
  expect(objUtils.isEmpty({})).toBe(true);
});

test('Test non empty object', () => {
  expect(objUtils.isEmpty({ key: 1 })).toBe(false);
});

test('Test undefined object', () => {
  expect(objUtils.isEmpty(null)).toBe(true);
});

/* eslint-enable no-undef */
