import Joi from 'joi';

export type PostRoleRequest = {
  name: string;
  isAdmin: boolean;
};

export type PutRoleRequest = PostRoleRequest & {
  id: number;
};

export type RoleResponse = {
  id: number;
  name: string;
  isAdmin: boolean;
  createOn: Date;
  updateOn?: Date;
};

export const baseRoleRequestSchema = Joi.object<
  PostRoleRequest | PutRoleRequest
>({
  name: Joi.string().min(3).max(32).required(),
  isAdmin: Joi.boolean().default(false),
});

export const postRoleRequestSchema =
  baseRoleRequestSchema as Joi.ObjectSchema<PostRoleRequest>;

export const putRoleRequestSchema = baseRoleRequestSchema.keys({
  id: Joi.number().integer().positive().required(),
}) as Joi.ObjectSchema<PutRoleRequest>;
