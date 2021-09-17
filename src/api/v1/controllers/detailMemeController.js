/* eslint-disable camelcase */
const statusCodes = require('../../../config/constants/statusCodes');
const Meme = require('../models/memes');
const authUtils = require('../utils/authUtils');
const objUtils = require('../utils/objUtils');

module.exports = async (request) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  try {
    const user = authUtils.getUser(request.headers.authorization);
    const newMeme = await Meme.findOne({ _id: request.query.id });
    if (objUtils.isEmpty(user)) {
      return {
        headers,
        statusCode: statusCodes.SUCCESS_OK,
        body: newMeme,
      };
    }
    const { view_count } = await Meme.findOne({ _id: request.query.id }).lean();
    const set = new Set([...view_count, user.id]);

    await Meme.update({ _id: request.query.id }, { view_count: [...set.keys()] });
    return {
      headers,
      statusCode: statusCodes.SUCCESS_OK,
      body: newMeme,
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
};
