const { BlobServiceClient } = require('@azure/storage-blob');

const statusCodes = require('../../../config/constants/statusCodes');
const dbConfig = require('../../../config/constants/dbConfig');
const Meme = require('../models/memes');
const authUtils = require('../utils/authUtils');

const uploadImage = async (memeData, base64) => {
  const client = await BlobServiceClient.fromConnectionString(process.env.AZURE_BLOB);
  const container = dbConfig.AZURE_CONTAINER;
  const containerClient = await client.getContainerClient(container);
  const blobName = `${memeData.heading}__${memeData.user}__${memeData.created}.png`.replace(' ', '_');
  const blobClient = containerClient.getBlockBlobClient(blobName);
  const buffer = Buffer.from(base64, 'base64');

  await blobClient.upload(buffer, buffer.length);
  return `https://thememestudio.blob.core.windows.net/thememestudio/${blobName}`;
};

module.exports = async (request) => {
  try {
    const memeData = {
      heading: request.body.heading,
      user: request.body.user_id,
      created: new Date(),
      view_count: [],
      state: request.body.state,
      status: request.body.status || 'ALL',
      type: request.body.type,
    };

    let user = {};

    if (request.headers && request.headers.authorization) {
      user = authUtils.getUser(request.headers.authorization);
    }

    memeData.user = user.id;

    const imageUrl = await uploadImage(memeData, request.body.image);

    memeData.image_url = imageUrl;
    memeData.thumbnail_url = imageUrl;

    if (request.body.type === 'TEMPLATE') {
      memeData.createdBy = user.id;
    }

    const newMeme = new Meme(memeData);

    if (request.body.meme_id) {
      return {
        statusCode: statusCodes.SUCCESS_OK,
        body: {
          message: 'Meme saved',
          data: await Meme.findOneAndUpdate({ _id: request.body.meme_id }, memeData),
        },
      };
    }
    return {
      statusCode: statusCodes.SUCCESS_OK,
      body: {
        message: 'Meme saved',
        data: await newMeme.save(),
      },
    };
  } catch (e) {
    return {
      statusCode: statusCodes.ERROR_INTERNAL,
      body: {
        error: e.message,
      },
    };
  }
};
