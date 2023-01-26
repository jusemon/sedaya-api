import { Request, Response, Router } from 'express';
import config from '../config';
import controller from '../middlewares/controller';
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
  controller({
    config,
    bodySchema: postRoleRequestSchema,
    action: async (req: ValidatedRequest<any, PostRoleRequest>, res) => {
      const result = await rolesService.create(req.validatedBody);
      res.status(HttpStatusCode.CREATED).json(result);
    },
  })
);

router.put(
  '/:id',
  controller({
    config,
    bodySchema: putRoleRequestSchema,
    action: async (
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
  controller({
    config,
    action: async (req: Request, res: Response) => {
      const result = await rolesService.remove(parseInt(req.params.id));
      res.status(HttpStatusCode.NO_CONTENT).json(result);
    },
  })
);

router.get(
  '/:id',
  controller({
    config,
    action: async (req, res) => {
      const result = await rolesService.read(parseInt(req.params.id));
      res.status(HttpStatusCode.OK).json(result);
    },
  })
);

router.get(
  '/',
  controller({
    config,
    querySchema: filterRequestParamsSchema,
    action: async (
      req: ValidatedRequest<any, any, FilterRequestParams>,
      res: Response
    ) => {
      const result = await rolesService.readAll(req.validatedQuery);
      res.json(result);
    },
  })
);

export default router;
