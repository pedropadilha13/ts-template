/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import 'reflect-metadata';
import { Methods } from '../definitions/enums/Methods';
import { MetadataKeys } from '../definitions/enums/MetadataKeys';

/**
 * HTTP Methods decorator function factory
 * @param method HTTP Method
 * @returns Decorator Function Factory for specified HTTP Method
 */
function routeBinder(method: string) {
  /**
   * Assign specified HTTP method to decorated function
   * @param path route path to be assigned to
   */
  return function bindPath(path: string) {
    /**
     * @param target callback function to be bound
     * @param key path to assign callback function to
     */
    return function routePathBinder(target: any, key: string) {
      Reflect.defineMetadata(MetadataKeys.path, path, target, key);
      Reflect.defineMetadata(MetadataKeys.method, method, target, key);
    };
  };
}

export const get = routeBinder(Methods.get);
export const post = routeBinder(Methods.post);
export const put = routeBinder(Methods.put);
export const del = routeBinder(Methods.del);
export const patch = routeBinder(Methods.patch);
