import Joi from 'joi';
import { Response } from '../common';
import { RoleResponse } from './role';

export type PostUserRequest = {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
};

export type PutUserRequest = PostUserRequest & {
  id: number;
};

export type UserResponse = {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  role?: RoleResponse;
  createOn: Date;
  updateOn?: Date;
};

export type UserResponseBody = Response<UserResponse>;

export const baseUserRequestSchema = Joi.object<
  PostUserRequest | PutUserRequest
>({
  name: Joi.string().min(5).max(32).required(),
  firstName: Joi.string().max(64).required(),
  lastName: Joi.string().max(64).required(),
  email: Joi.string().email().required(),
  roleId: Joi.number().positive().integer().required(),
});

export const postUserRequestSchema = baseUserRequestSchema as Joi.ObjectSchema<PostUserRequest>;

export const putUserRequestSchema = baseUserRequestSchema.keys({
  id: Joi.number().integer().positive().required(),
}) as Joi.ObjectSchema<PutUserRequest>;
