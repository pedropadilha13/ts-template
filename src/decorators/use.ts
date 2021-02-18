/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from 'express';
import 'reflect-metadata';
import { MetadataKeys } from '../definitions/enums/MetadataKeys';

/**
 *
 * @param {RequestHandler} middleware Adds new middleware to registered middlewares array on target functions Metadata
 */
export function use(middleware: RequestHandler) {
  return function (target: any, key: string): void {
    const middlewares = Reflect.getMetadata(MetadataKeys.middleware, target, key) || [];
    Reflect.defineMetadata(MetadataKeys.middleware, [...middlewares, middleware], target, key);
  };
}
