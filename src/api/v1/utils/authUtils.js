const jwt = require('jsonwebtoken');

module.exports = {
  getUser: (authorization) => {
    if (!authorization) return {};
    const decoded = jwt.verify(authorization.split(' ')[1], process.env.SECRET);
    return decoded;
  },
};
