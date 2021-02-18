import { Request, Response } from 'express';

// Controller
export type ViewHandler = (req: Request, res: Response) => Promise<Injectables>;
export type Injectables = { [key: string]: any };

export interface ControllerDetails {
  name?: string;
  description?: string;
}

// Body Validator
export type BodyValidatorTuple = [string, string];

export interface BodyValidator {
  name: string;
  message: string;
}

export interface BodyValidatorOptions {
  type: 'api' | 'view';
  failureRedirect: string;
}

export type BodyValidatorProps = string | BodyValidatorTuple | BodyValidator;
