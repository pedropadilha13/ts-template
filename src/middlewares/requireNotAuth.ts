import { Request, Response, NextFunction } from 'express';

/**
 * Ensures request is NOT authenticated
 *
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @param {NextFunction} next Express NextFunction
 */
export default function requireNotAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.isAuthenticated()) {
    next();
    return;
  }

  res.redirect('/');
}
