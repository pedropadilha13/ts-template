import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';

import { UserModel as User } from '../models';
import { logger } from './logger';

const LocalStrategy = passportLocal.Strategy;
const { Strategy: JWTStrategy, ExtractJwt } = passportJWT;

const { JWT_SECRET } = process.env;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).orFail();
    done(null, user);
  } catch (error) {
    logger.error(error);
    done(error);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      try {
        const user = await User.findByEmail(email);
        if (user && user.verifyPassword(password)) {
          return done(undefined, user);
        }
      } catch (error) {
        return done(error);
      }

      return done(undefined, false, { message: 'Invalid email or password' });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload._id);
        if (user) {
          return done(undefined, user);
        }
      } catch (error) {
        return done(error);
      }

      return done(undefined, false, { message: 'Invalid JWT' });
    }
  )
);
