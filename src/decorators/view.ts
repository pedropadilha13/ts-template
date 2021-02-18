/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { Message } from '../definitions/interfaces/Message';
import { FlashTypes } from '../definitions/enums/FlashTypes';
import { MetadataKeys } from '../definitions/enums/MetadataKeys';

/**
 * Consumes, parses and adds all registered Flash Messages to res.locals.messages
 *
 * @function
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const flashMessages = async (req: Request, res: Response, next: NextFunction) => {
  const messages: Message[] = [];
  for (const flashType of Object.values(FlashTypes)) {
    const typeMessages = await req.consumeFlash(flashType);
    const parsedMessages = typeMessages.map(content => ({
      variant: flashType as FlashTypes,
      content
    }));

    messages.push(...parsedMessages);
  }

  res.locals.messages = messages;
  next();
};

/**
 * Renders specified page
 *
 * @function
 * @param {string} page view to be included inside the main view
 * @param {string} extras additional local parameters
 */
const render = (page: string, extras: any) =>
  function render(req: Request, res: Response): void {
    res.render('main', {
      page,
      ...extras
    });
    return;
  };

/**
 * Marks decorated function as View, defines the view file name and defines locals parameters
 *
 * @param page
 * @param extras
 * @returns Decorator Function
 */
export function view(page: string, extras?: any) {
  return function view(target: any, key: string): void {
    const middlewares = Reflect.getMetadata(MetadataKeys.middleware, target, key) || [];
    Reflect.defineMetadata(MetadataKeys.middleware, [...middlewares, flashMessages], target, key);
    Reflect.defineMetadata(MetadataKeys.render, render(page, extras), target, key);
  };
}
