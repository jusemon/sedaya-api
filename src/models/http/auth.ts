import Joi from 'joi';
import { Response } from '../common';

export type PostAuthRequest = {
  username: string;
  password: string;
};

export type PostAuthResponse = {
  userId: number;
  username: string;
  token: string;
};

export type PostAuthResponseBody = Response<PostAuthResponse>;

export const postAuthRequestSchema = Joi.object<PostAuthRequest>({
  username: Joi.string().min(5).max(32).required(),
  password: Joi.string()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,32}$/)
    .required(),
});
