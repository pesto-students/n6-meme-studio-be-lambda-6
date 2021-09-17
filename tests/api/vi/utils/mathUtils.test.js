const mathUtils = require('../../../../src/api/v1/utils/mathUtils');

/* eslint-disable no-undef */

test('adds 1 + 2 to equal 3', () => {
  expect(mathUtils.sum(1, 2)).toBe(3);
});

/* eslint-enable no-undef */
