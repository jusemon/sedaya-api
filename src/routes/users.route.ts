import { Request, Response, Router } from 'express';
import config from '../config';
import controller from '../middlewares/controller';
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

/**
 * @openapi
 * /users/:
 *   post:
 *     summary: Create an user
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: The user to create
 *       required: true
 *       content:
 *         application/json:
 *           schema: *user-request-post-schema
 *     responses:
 *       201:
 *         description: User saved successfully
 *         content:
 *           application/json:
 *             schema: *user-response-schema
 */
router.post(
  '/',
  controller({
    config,
    bodySchema: postUserRequestSchema,
    action: async (req: ValidatedRequest<any, PostUserRequest>, res) => {
      const result = await usersService.create(req.validatedBody);
      res.status(HttpStatusCode.CREATED).json(result);
    },
  })
);

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update an user
 *     tags:
 *       - users
 *     produces:
 *       - application/json
 *     parameters:
 *       - *user-id
 *     requestBody:
 *       description: The user to update
 *       required: true
 *       content:
 *         application/json:
 *           schema: *user-request-put-schema
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema: *user-response-schema
 */
router.put(
  '/:id',
  controller({
    config,
    bodySchema: putUserRequestSchema,
    action: async (
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

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by given id
 *     tags:
 *       - users
 *     parameters:
 *       - *user-id
 *     responses:
 *       204:
 *         description: User deleted successfully
 */
router.delete(
  '/:id',
  controller({
    config,
    action: async (req: Request, res: Response) => {
      const result = await usersService.remove(parseInt(req.params.id));
      res.status(HttpStatusCode.NO_CONTENT).json(result);
    },
  })
);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Get a user by given id
 *     tags:
 *       - users
 *     parameters:
 *       - *user-id
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.get(
  '/:id',
  controller({
    config,
    action: async (req, res) => {
      const result = await usersService.read(parseInt(req.params.id));
      res.status(HttpStatusCode.OK).json(result);
    },
  })
);

/**
 * @openapi
 * /users/:
 *   get:
 *     summary: Get a list of users
 *     tags:
 *       - users
 *     parameters: *filter-request-params-schema
 *     responses:
 *       200:
 *         description: Users returned successfully
 *         content:
 *           application/json:
 *             schema: *user-response-list-schema
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
      const result = await usersService.readAll(req.validatedQuery);
      res.json(result);
    },
  })
);

export default router;
