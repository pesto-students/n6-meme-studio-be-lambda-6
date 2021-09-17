const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const authUtils = require('../../../../src/api/v1/utils/authUtils');

/* eslint-disable no-undef */

test('test non-empty auth header', () => {
  stub = sinon.stub(jwt, 'verify').callsFake(() => ({ success: 'Token is valid' }));
  expect(Object.keys(authUtils.getUser('yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoidGVzdCIsImlkIjoiNjEzYTUxZTJmYTBlMzAwMDQ1ZjBlM2JmIiwiaWF0IjoxNjMxMzU3NTk2fQ.3RGFMO890ObQ3X-b7H6BZg8x-xSet__ZDiTuhk9Mdq0')).length).toBe(1);
});

test('test empty auth header', () => {
  expect(Object.keys(authUtils.getUser(null)).length).toBe(0);
});
