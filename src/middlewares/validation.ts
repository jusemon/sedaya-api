import { Request, Response, NextFunction } from 'express';
import Joi, { ValidationError } from 'joi';
import HttpStatusCode from '../models/http-status-code';

export type ValidationMiddlewareProps<Params = any, Body = any, Query = any> = {
  paramsSchema?: Joi.Schema<Params>;
  bodySchema?: Joi.Schema<Body>;
  querySchema?: Joi.Schema<Query>;
};

export type ValidatedRequest<Params = any, Body = any, Query = any> = Request & {
  validatedParams: Params;
  validatedBody: Body;
  validatedQuery: Query;
};

const validationMiddleware =
  ({ paramsSchema, bodySchema, querySchema }: ValidationMiddlewareProps) =>
  (req: Request, res: Response, next: NextFunction) => {
    const validatedReq = req as ValidatedRequest;
    const errors: Array<ValidationError> = [];

    if (paramsSchema) {
      const { error, value } = paramsSchema.validate(req.params);
      validatedReq.validatedParams = value;
      if (error) errors.push(error);
    }

    if (bodySchema) {
      const { error, value } = bodySchema.validate(req.body);
      validatedReq.validatedBody = value;
      if (error) errors.push(error);
    }

    if (querySchema) {
      const { error, value } = querySchema.validate(req.query);
      validatedReq.validatedQuery = value;
      if (error) errors.push(error);
    }

    if (errors.length > 0) {
      res.status(HttpStatusCode.NOT_ACCEPTABLE).json(
        errors.map((error) => ({
          name: error.name,
          message: error.message,
          details: error.details,
        }))
      );
      return;
    }

    next();
  };

export default validationMiddleware;
