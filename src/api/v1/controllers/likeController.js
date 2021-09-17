const statusCodes = require('../../../config/constants/statusCodes');

const Meme = require('../models/memes');
const authUtils = require('../utils/authUtils');
const objUtils = require('../utils/objUtils');

module.exports = async (request) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const { action, memeId } = request.body;
  let user = {};
  if (request.headers && request.headers.authorization) {
    user = authUtils.getUser(request.headers.authorization);
  }

  if (!memeId || objUtils.isEmpty(user)) {
    return {
      headers,
      statusCode: statusCodes.ERROR_INTERNAL,
      body: 'Malformed request',
    };
  }

  const meme = await Meme.findOne({ _id: memeId });
  if (!meme) {
    return {
      headers,
      statusCode: statusCodes.ERROR_INTERNAL,
      body: 'No meme found with the provided ID',
    };
  }
  const { likes, dislikes } = meme;

  if (action === 'LIKE') {
    const indexExist = likes.indexOf(user.id);
    if (indexExist > -1) {
      delete likes[indexExist];
    } else {
      likes.push(user.id);
    }
    const indexTBD = dislikes.indexOf(user.id);
    if (indexTBD > -1) {
      delete dislikes[indexTBD];
    }
  } else if (action === 'DISLIKE') {
    const indexExist = dislikes.indexOf(user.id);
    if (indexExist > -1) {
      delete dislikes[indexExist];
    } else {
      dislikes.push(user.id);
    }
    const indexTBD = likes.indexOf(user.id);
    if (indexTBD > -1) {
      delete likes[indexTBD];
    }
  } else {
    return {
      headers,
      statusCode: statusCodes.ERROR_INTERNAL,
      body: 'Malformed request',
    };
  }
  const likeSet = new Set(likes);
  const dislikeSet = new Set(dislikes);

  await Meme.update({ _id: memeId },
    {
      likes: [...likeSet.keys()].filter((like) => (like)),
      dislikes: [...dislikeSet.keys()].filter((like) => like),
    });

  return {
    headers,
    statusCode: statusCodes.SUCCESS_OK,
    body: 'Liked/Disliked Successful',
  };
};
