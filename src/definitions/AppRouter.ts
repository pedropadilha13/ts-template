import { Methods } from './enums/Methods';

export interface Route {
  path: string;
  method: Methods;
  description?: string;
  handlers?: string[];
}

export interface Controller {
  name?: string;
  path: string;
  description?: string;
  routes: Route[];
}

export interface Controllers {
  [key: string]: Controller;
}
