const mongoose = require('mongoose');
const dbConfig = require('../../../config/constants/dbConfig');
const logger = require('./loggingService');

const databaseService = {
  connect: async () => {
    try {
      await mongoose.connect(dbConfig.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      });
      logger.info('Database connected');
    } catch (e) {
      logger.error(`ERROR: Database connection failed: ${e}`);
    }
  },
};

module.exports = databaseService;
