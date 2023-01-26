import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { Config } from '../models/config';
import HttpStatusCode from '../models/http-status-code';
import { AppError } from '../utils/error';
import logger from '../utils/logger';
import validationMiddleware, {
  ValidatedRequest,
  ValidationMiddlewareProps,
} from './validation';

type ControllerMiddlewareProps<
  Params = any,
  Body = any,
  Query = any
> = ValidationMiddlewareProps<Params, Body, Query> & {
  config: Config;
  action: (
    req: ValidatedRequest<Params, Body, Query>,
    res: Response
  ) => PromiseLike<void> | void;
};

const controllerMiddleware =
  ({
    action,
    bodySchema,
    paramsSchema,
    querySchema,
    config,
  }: ControllerMiddlewareProps) =>
  (req: Request, res: Response, next: NextFunction) => {
    validationMiddleware({ bodySchema, paramsSchema, querySchema })(
      req,
      res,
      () => {
        const log = logger(config);
        Promise.resolve(action(req as ValidatedRequest, res))
          .then(() => next())
          .catch((error) => {
            const errorMap = (details: any) => ({
              name: error.name,
              message: error.message,
              details: details,
            });
            let mappedError;
            if (error instanceof AppError) {
              mappedError = errorMap(error.parent);
              res.status(error.status).json(mappedError);
            } else if (error instanceof ValidationError) {
              mappedError = errorMap(error.details);
              res.status(HttpStatusCode.NOT_ACCEPTABLE).json(mappedError);
            } else {
              mappedError = errorMap(error.stack);
              res
                .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                .json(mappedError);
            }
            log.error(mappedError);
            return;
          });
      }
    );
  };

export default controllerMiddleware;
