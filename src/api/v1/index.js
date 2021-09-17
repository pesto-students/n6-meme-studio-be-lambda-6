const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(session({
  secret: 'secretcode',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    signed: true,
  },
}));

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

app.use(cookieParser('secretcode'));

app.use(passport.initialize());
app.use(passport.session());

require('../../config/constants/passportConfig')(passport);

app.use(cors());

require('dotenv').config();

const db = require('./sevices/databaseService');
const logger = require('./sevices/loggingService');

db.connect();

require('./routes')(app, passport);

app.listen(process.env.PORT, () => {
  logger.info(`Server is up at PORT: ${process.env.PORT}`);
});
