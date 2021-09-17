const callback = require('../callback');

const getMemesController = require('../controllers/getMemesController');
const saveMemeController = require('../controllers/saveMemeController');
const authController = require('../controllers/authController');
const detailsMemeController = require('../controllers/detailMemeController');
const likeController = require('../controllers/likeController');
const pingController = require('../controllers/pingController');
const imageController = require('../controllers/imageController');

module.exports = (app, passport) => {
  app.post('/register', callback(authController.register));
  app.post('/login', callback(authController.login));
  app.get('/ping', callback(pingController));
  app.get('/listings', callback(getMemesController));
  app.post('/save', callback(saveMemeController));
  app.get('/info', callback(detailsMemeController));
  app.post('/upload', passport.authenticate('jwt', { session: false }), callback(imageController));
  app.get('/getUser', passport.authenticate('jwt', { session: false }), callback(authController.getUser));
  app.post('/like', passport.authenticate('jwt', { session: false }), callback(likeController));
};
