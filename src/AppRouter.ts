import _ from 'lodash';
import { table } from 'table';
import { Router } from 'express';
import { Controllers, Controller, Route } from './definitions/interfaces';

type TableData = [string, string, string | undefined, string | undefined];

/**
 * Express Router for the entire Application
 */
export class AppRouter {
  private static instance: Router;
  private static controllerStore: Controllers = {};

  /**
   * Get all registered controllers
   */
  static get controllers(): Controllers {
    return AppRouter.controllerStore;
  }

  /**
   * Get Express Router Instance
   */
  static getInstance(): Router {
    if (!AppRouter.instance) {
      AppRouter.instance = Router();
    }

    return AppRouter.instance;
  }

  /**
   * Register new Controller
   *
   * @param controller New Controller to be registered
   */
  static addController(controller: Controller): void {
    Object.assign(AppRouter.controllerStore, { [controller.path]: controller });
  }

  /**
   * Register new Express Route to given path
   *
   * @param path route path
   * @param route Express Route to be registered
   */
  static addRoute(path: string, route: Route): void {
    const controller = AppRouter.controllerStore[path];
    controller.routes.push(route);
    AppRouter.controllerStore[path] = controller;
  }

  /**
   * Prints all registered routes as formatted table to stdout
   */
  static listRoutes(): void {
    // eslint-disable-next-line no-console
    console.log('Registered routes info:');
    _.forEach(AppRouter.controllers, (controller: Controller): void => {
      const tableData = [
        [controller.name, controller.path, controller.description, 'Registered Handlers:'],
        ..._.map(
          controller.routes,
          (route: Route): TableData => {
            return [route.method.toUpperCase(), route.path, route.description, route.handlers?.join(', ')];
          }
        )
      ];
      // eslint-disable-next-line no-console
      console.log(table(tableData));
    });
  }
}
