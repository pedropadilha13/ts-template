/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { AppRouter } from '../AppRouter';
import { controller, get, bodyValidator, post } from '../decorators';

/**
 * @classdesc Index Controller
 */
@controller('/', { name: 'Index', description: 'Default Controller' })
export class Index {
  /**
   * Hello World
   * @param req Express Request
   * @param res Express Response
   */
  @get('/')
  index(req: Request, res: Response): void {
    res.send('Hello World!');
  }

  /**
   * List all registered routes in JSON format
   *
   * @param req Express Request
   * @param res Express Response
   */
  @get('/routes')
  routes(req: Request, res: Response): void {
    res.send(AppRouter.controllers);
  }
}
