import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

/**
 * Ensures request is authenticated
 *
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @param {NextFunction} next Express NextFunction
 */
export default function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
    next();
    return;
  } else if (req.headers.authorization) {
    passport.authenticate('jwt', { session: false })(req, res, next);
    return;
  }

  res.status(403).redirect('/auth/login');
}
