/* eslint-disable @typescript-eslint/no-unused-vars */
import dotenv from 'dotenv';
dotenv.config();
const { PORT = 3000, SESSION_SECRET = 'keyboard cat', NODE_ENV } = process.env;

import path from 'path';
import morgan from 'morgan';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import createHttpError from 'http-errors';
import { flash } from 'express-flash-message';
import express, { ErrorRequestHandler } from 'express';

import { logger, connectDB } from './services';
import { AppRouter } from './AppRouter';

import * as models from './models';

import './controllers/Index';
import './controllers/Auth';
import './controllers/Tasks';

import { BaseDir } from './utils';

import './services/passport';
import { Config } from './Config';

const dbConnection = connectDB();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({ name: 'task-session', keys: [SESSION_SECRET], httpOnly: false, maxAge: 3600, secure: false }));
app.use(flash({ sessionKeyName: 'flashMessage', useCookieSession: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(AppRouter.getInstance());

app.use((req, res, next) => {
  next(createHttpError(404));
});

app.use(((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
}) as ErrorRequestHandler);

app.listen(PORT, () => {
  logger.info(`App listening on port ${PORT}`);
  BaseDir.baseDir = path.normalize(`${__dirname}/..`);

  if (NODE_ENV !== 'production') {
    AppRouter.listRoutes();
    logger.debug(`Set baseDir to ${BaseDir.baseDir}`);
  }

  Config.get();
});
