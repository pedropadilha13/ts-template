/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import 'reflect-metadata';
import { MetadataKeys } from '../definitions/enums/MetadataKeys';
import { BodyValidatorOptions, BodyValidatorProps } from '../definitions/Decorators';

/**
 * Adds keys and options to function Metadata
 *
 * @param {BodyValidatorProps} keys Body Validator Props array
 * @param {BodyValidatorOptions} options Body Validator Options
 */
export function bodyValidator(keys: BodyValidatorProps[], options?: BodyValidatorOptions) {
  return function (target: any, key: string): void {
    Reflect.defineMetadata(MetadataKeys.validator, { keys, options }, target, key);
  };
}
