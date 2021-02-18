import 'reflect-metadata';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { MetadataKeys, Methods } from '.';
import { AppRouter } from '../AppRouter';
import { ControllerDetails, ViewHandler, BodyValidatorProps, BodyValidatorOptions } from '../definitions/Decorators';

/**
 * Ensures next() is called after handler is executed and defines 'name' Metadata property
 * @param handler Express RequestHandler
 */
function next(handler: ViewHandler) {
  function nextify(req: Request, res: Response, next: NextFunction): void {
    (async () => {
      const inject = await handler(req, res);
      Object.assign(res.locals, inject);
    })().then(() => {
      next();
    });
  }

  Reflect.defineMetadata('name', Reflect.getMetadata('name', handler), nextify);

  return nextify;
}

/**
 * Simple Request Body validation
 *
 * @param keys properties to be validated
 * @param type Decides output format ('api' | 'view')
 */
function bodyValidators(keys: BodyValidatorProps[], options?: BodyValidatorOptions): RequestHandler {
  return function bodyValidator(req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      res.status(422).send('Invalid request');
      return;
    }

    const errors: { [key: string]: string } = {};

    for (const key of keys) {
      let property: string;
      let message: string;

      if (typeof key === 'string') {
        property = key;
        message = `Missing property ${key}`;
      } else if (key instanceof Array) {
        property = key[0];
        message = key[1];
      } else {
        property = key.name;
        message = key.message;
      }

      if (!req.body[property]) {
        errors[property] = message;
      }
    }

    if (Object.keys(errors).length > 0) {
      switch (options?.type) {
        case 'view':
          res.status(422).render('main', {
            page: options.failureRedirect,
            errors
          });
          return;
        case 'api':
        default:
          res.status(422).send({ errors });
          return;
      }
    }

    next();
  };
}

/**
 * Assembles and registers new Controller
 *
 * @param routePrefix Controller prefix
 * @param details Controller Details (optional)
 */
export function controller(routePrefix: string, details: ControllerDetails = {}) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (target: Function): void {
    const router = AppRouter.getInstance();

    const { name, description: controllerDescription } = details;

    AppRouter.addController({
      path: routePrefix,
      routes: [],
      name,
      description: controllerDescription
    });

    for (const key in target.prototype) {
      const routeHandler: RequestHandler | ViewHandler = target.prototype[key];
      const path = Reflect.getMetadata(MetadataKeys.path, target.prototype, key);
      const method: Methods = Reflect.getMetadata(MetadataKeys.method, target.prototype, key);
      const middlewares = Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) || [];
      const { keys: requiredBodyProps, options } =
        Reflect.getMetadata(MetadataKeys.validator, target.prototype, key) || [];
      const description = Reflect.getMetadata(MetadataKeys.description, target.prototype, key);
      const render = Reflect.getMetadata(MetadataKeys.render, target.prototype, key);

      const validator = bodyValidators(requiredBodyProps, options);

      const finalPath = `${routePrefix !== '/' ? routePrefix : ''}${path}`;

      Reflect.defineMetadata('name', key, routeHandler);

      let handlers;
      if (render) {
        handlers = [...middlewares, validator, next(routeHandler as ViewHandler), render];
      } else {
        handlers = [...middlewares, validator, routeHandler];
      }

      if (path) {
        router[method](finalPath, handlers);

        AppRouter.addRoute(routePrefix, {
          method,
          path,
          description: `${render ? '[View] ' : ''}${description || ''}`,
          handlers: handlers.reduce((names, handler) => {
            const name = Reflect.getMetadata('name', handler) || handler.name;
            return [...names, name];
          }, [])
        });
      }
    }
  };
}
