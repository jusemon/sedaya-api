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
  controller: (
    req: ValidatedRequest<Params, Body, Query>,
    res: Response
  ) => PromiseLike<void> | void;
};

const controllerMiddleware =
  ({
    controller,
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
        Promise.resolve(controller(req as ValidatedRequest, res))
          .then(() => next())
          .catch((error) => {
            if (error instanceof AppError) {
              res.status(error.status).json({
                name: error.name,
                message: error.message,
                parent: error.parent,
              });
            } else if (error instanceof ValidationError) {
              res.status(HttpStatusCode.NOT_ACCEPTABLE).json(
                [error].map((error) => ({
                  name: error.name,
                  message: error.message,
                  details: error.details,
                }))
              );
            } else {
              const log = logger(config);
              const detail = {
                name: error.name,
                message: error.message,
                stack: error.stack,
              };
              log.error(detail);
              res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(detail);
            }
            return;
          });
      }
    );
  };

export default controllerMiddleware;
