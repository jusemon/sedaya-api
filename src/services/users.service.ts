import { FilterRequestParams, Service } from '../models/common';
import { User } from '../models/database';
import { PostUserRequest, PutUserRequest, UserResponse } from '../models/http';
import usersRepository from '../repositories/users.repository';

type UsersService = Service<PostUserRequest, PutUserRequest, UserResponse>;

const create = async (user: PostUserRequest) => {
  return await usersRepository.create({ ...user } as User);
};

const update = async (user: PutUserRequest) => {
  return await usersRepository.update({ ...user } as User);
};

const read = async (id: number) => {
  return await usersRepository.read(id);
};

const readAll = async (filter: FilterRequestParams) => {
  return await usersRepository.readAll(filter);
};

const remove = async (id: number) => {
  return await usersRepository.remove(id);
};

export default {
  create,
  read,
  readAll,
  update,
  remove,
} as UsersService;
