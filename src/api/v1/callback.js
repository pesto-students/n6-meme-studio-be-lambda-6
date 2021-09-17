module.exports = function callback(controller) {
  return (req, res) => {
    controller(req)
      .then((httpResponse) => {
        res.type('json');
        res.status(httpResponse.statusCode).send(httpResponse.body);
      })
      // .catch(() => res.status(500).send({ error: 'An unkown error occurred.' }));
  };
};
