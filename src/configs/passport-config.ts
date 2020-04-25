import passport from 'koa-passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user-model';

passport.serializeUser((user: User, done): void => {
  done(null, user.id);
});

passport.deserializeUser((id: number, done): void => {
  User.query()
    .findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

passport.use(
  new LocalStrategy((username, password, done) => {
    User.query()
      .findOne({ username: username.toLowerCase().trim() })
      .then(async (user) => {
        if (!user) {
          return done(null, false);
        }

        if (await user.validatePassword(password)) {
          return done(null, user);
        }

        return done(null, false);
      })
      .catch((err) => {
        return done(err);
      });
  }),
);
