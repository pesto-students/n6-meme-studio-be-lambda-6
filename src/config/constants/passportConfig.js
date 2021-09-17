// const LocalStrategy = require("passport-local").Strategy;
const { Strategy, ExtractJwt } = require('passport-jwt');
// const bcrypt = require('bcryptjs');

const User = require('../../api/v1/models/users');

module.exports = (passport) => {
  passport.use('jwt',
    new Strategy({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    }, (jwtPayload, done) => {
      User.findOne({ _id: jwtPayload.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    }));

  passport.serializeUser((user, callback) => {
    callback(null, user.id);
  });

  passport.deserializeUser((id, callback) => {
    User.findOne({ _id: id }, (err, user) => {
      callback(err, user);
    });
  });
};
