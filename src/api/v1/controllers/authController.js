const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const statusCodes = require('../../../config/constants/statusCodes');
const authUtils = require('../utils/authUtils');

module.exports = {
  login: async (request) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    const result = await User.findOne({ username: request.body.username });
    if (!result) {
      return {
        headers,
        statusCode: statusCodes.ERROR_INTERNAL,
        body: 'User not found/Incorrect password',
      };
    }
    const match = await bcrypt.compare(request.body.password, result.password);
    if (match) {
      const params = {
        username: result.username,
        // eslint-disable-next-line no-underscore-dangle
        id: result._id,
      };
      const token = await jwt.sign(params, process.env.SECRET);
      return {
        headers,
        statusCode: statusCodes.SUCCESS_OK,
        body: {
          username: result.username,
          id: result.id,
          token,
        },
      };
    }
    return {
      headers,
      statusCode: statusCodes.ERROR_INTERNAL,
      body: 'User not found/Incorrect password',
    };
  },
  getUser: async (request) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (request.headers && request.headers.authorization) {
      return {
        headers,
        statusCode: statusCodes.SUCCESS_OK,
        body: authUtils.getUser(request.headers.authorization),
      };
    }
    return {
      headers,
      statusCode: statusCodes.ERROR_INTERNAL,
      body: 'Unauthorized',
    };
  },
  register: async (request) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    try {
      const doc = await User.findOne({ username: request.body.username });
      if (doc) {
        return {
          headers,
          statusCode: statusCodes.ERROR_REQ,
          body: 'User already exists',
        };
      }
      const newUser = new User({
        username: request.body.username,
        password: await bcrypt.hash(request.body.password, 10),
      });
      await newUser.save();
      return {
        headers,
        statusCode: statusCodes.SUCCESS_OK,
        body: 'User registered',
      };
    } catch (e) {
      return {
        headers,
        statusCode: statusCodes.ERROR_INTERNAL,
        body: {
          error: e.message,
        },
      };
    }
  },
};
