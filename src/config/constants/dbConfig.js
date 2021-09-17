const constants = Object.freeze({
  MONGO_URL: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5citd.mongodb.net/thememestudio?retryWrites=true&w=majority`,
  AZURE_CONTAINER: 'thememestudio',
});

module.exports = constants;
