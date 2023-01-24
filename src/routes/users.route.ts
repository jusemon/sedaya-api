import { Request, Response, Router } from 'express';
import config from '../config';
import controllerMw from '../middlewares/controller';
import { ValidatedRequest } from '../middlewares/validation';
import {
  FilterRequestParams,
  filterRequestParamsSchema,
} from '../models/common';
import {
  PostUserRequest,
  postUserRequestSchema,
  PutUserRequest,
  putUserRequestSchema,
} from '../models/http';
import HttpStatusCode from '../models/http-status-code';
import usersService from '../services/users.service';
const router = Router();

router.post(
  '/',
  controllerMw({
    config,
    bodySchema: postUserRequestSchema,
    controller: async (req: ValidatedRequest<any, PostUserRequest>, res) => {
      const result = await usersService.create(req.validatedBody);
      res.status(HttpStatusCode.CREATED).json(result);
    },
  })
);

router.put(
  '/:id',
  controllerMw({
    config,
    bodySchema: putUserRequestSchema,
    controller: async (
      req: ValidatedRequest<any, PutUserRequest>,
      res: Response
    ) => {
      const result = await usersService.update({
        ...req.validatedBody,
        id: parseInt(req.params.id),
      });
      res.status(HttpStatusCode.OK).json(result);
    },
  })
);

router.delete(
  '/:id',
  controllerMw({
    config,
    controller: async (req: Request, res: Response) => {
      const result = await usersService.remove(parseInt(req.params.id));
      res.status(HttpStatusCode.NO_CONTENT).json(result);
    },
  })
);

router.get(
  '/:id',
  controllerMw({
    config,
    controller: async (req, res) => {
      const result = await usersService.read(parseInt(req.params.id));
      res.status(HttpStatusCode.OK).json(result);
    },
  })
);

router.get(
  '/',
  controllerMw({
    config,
    querySchema: filterRequestParamsSchema,
    controller: async (
      req: ValidatedRequest<any, any, FilterRequestParams>,
      res: Response
    ) => {
      const result = await usersService.readAll(req.validatedQuery);
      res.json(result);
    },
  })
);

export default router;
