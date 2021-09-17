const { BlobServiceClient } = require('@azure/storage-blob');

const statusCodes = require('../../../config/constants/statusCodes');
const dbConfig = require('../../../config/constants/dbConfig');
const authUtils = require('../utils/authUtils');

const uploadImage = async (memeData, base64) => {
  const client = await BlobServiceClient.fromConnectionString(process.env.AZURE_BLOB);
  const container = dbConfig.AZURE_CONTAINER;
  const containerClient = await client.getContainerClient(container);
  const blobName = `${memeData.heading}__${memeData.user_id}__${memeData.created}.png`;
  const blobClient = containerClient.getBlockBlobClient(blobName);
  const buffer = Buffer.from(base64, 'base64');

  await blobClient.upload(buffer, buffer.length);
  return `https://thememestudio.blob.core.windows.net/thememestudio/${blobName}`;
};

module.exports = async (request) => {
  try {
    let user = {};
    const headers = {
      'Content-Type': 'application/json',
    };
    if (request.headers && request.headers.authorization) {
      user = authUtils.getUser(request.headers.authorization);
    }

    const url = await uploadImage({
      heading: request.body.fileName,
      user_id: user._id,
      created: new Date(),
    }, request.body.base64);
    return {
      headers,
      statusCode: statusCodes.SUCCESS_OK,
      body: {
        url,
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
