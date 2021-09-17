const statusCodes = require('../../../config/constants/statusCodes');

module.exports = () => ({
  statusCode: statusCodes.SUCCESS_OK,
  body: 'pong',
});
