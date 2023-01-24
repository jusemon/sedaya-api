import { Request, Response, Router } from 'express';
import config from '../config';
import controllerMw from '../middlewares/controller';
import { ValidatedRequest } from '../middlewares/validation';
import {
  FilterRequestParams,
  filterRequestParamsSchema,
} from '../models/common';
import {
  PostRoleRequest,
  postRoleRequestSchema,
  PutRoleRequest,
  putRoleRequestSchema,
} from '../models/http';
import HttpStatusCode from '../models/http-status-code';
import rolesService from '../services/roles.service';
const router = Router();

router.post(
  '/',
  controllerMw({
    config,
    bodySchema: postRoleRequestSchema,
    controller: async (req: ValidatedRequest<any, PostRoleRequest>, res) => {
      const result = await rolesService.create(req.validatedBody);
      res.status(HttpStatusCode.CREATED).json(result);
    },
  })
);

router.put(
  '/:id',
  controllerMw({
    config,
    bodySchema: putRoleRequestSchema,
    controller: async (
      req: ValidatedRequest<any, PutRoleRequest>,
      res: Response
    ) => {
      const result = await rolesService.update({
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
      const result = await rolesService.remove(parseInt(req.params.id));
      res.status(HttpStatusCode.NO_CONTENT).json(result);
    },
  })
);

router.get(
  '/:id',
  controllerMw({
    config,
    controller: async (req, res) => {
      const result = await rolesService.read(parseInt(req.params.id));
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
      const result = await rolesService.readAll(req.validatedQuery);
      res.json(result);
    },
  })
);

export default router;
