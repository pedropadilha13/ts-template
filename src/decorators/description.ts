/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import 'reflect-metadata';
import { MetadataKeys } from '../definitions/enums/MetadataKeys';

/**
 * Adds 'description' key to Class or Function Metadata
 * @param {string} description description of Class or Function
 */
export function description(description: string) {
  return function (target: any, key: string) {
    Reflect.defineMetadata(MetadataKeys.description, description, target, key);
  };
}
