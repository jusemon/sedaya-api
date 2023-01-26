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

/**
 * @openapi
 * /roles/:
 *   post:
 *     summary: Create a role
 *     tags:
 *       - roles
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: The role to update
 *       required: true
 *       content:
 *         application/json:
 *           schema: *role-request-post-schema
 *     responses:
 *       201:
 *         description: Role saved successfully
 *         content:
 *           application/json:
 *             schema: *role-response-schema
 */
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

/**
 * @openapi
 * /roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags:
 *       - roles
 *     produces:
 *       - application/json
 *     parameters:
 *       - *role-id
 *     requestBody:
 *       description: The role to update
 *       required: true
 *       content:
 *         application/json:
 *           schema: *role-request-put-schema
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema: *role-response-schema
 */
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

/**
 * @openapi
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role by given id
 *     tags:
 *       - roles
 *     parameters:
 *       - *role-id
 *     responses:
 *       204:
 *         description: Role deleted successfully
 */
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

/**
 * @openapi
 * /roles/{id}:
 *   get:
 *     summary: Get a role by given id
 *     tags:
 *       - roles
 *     parameters:
 *       - *role-id
 *     responses:
 *       200:
 *         description: Role deleted successfully
 */
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

/**
 * @openapi
 * /roles/:
 *   get:
 *     summary: Get a list of roles
 *     tags:
 *       - roles
 *     parameters: *filter-request-params-schema
 *     responses:
 *       200:
 *         description: Roles returned successfully
 *         content:
 *           application/json:
 *             schema: *role-response-list-schema
 */
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
      res.status(HttpStatusCode.OK).json(result);
    },
  })
);

export default router;
