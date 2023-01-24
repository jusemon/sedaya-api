import { FilterRequestParams, Service } from '../models/common';
import { Role } from '../models/database';
import { PostRoleRequest, PutRoleRequest, RoleResponse } from '../models/http';
import rolesRepository from '../repositories/roles.repository';

type RolesService = Service<PostRoleRequest, PutRoleRequest, RoleResponse>;

const create = async (role: PostRoleRequest) => {
  return await rolesRepository.create({ ...role } as Role);
};

const update = async (role: PutRoleRequest) => {
  return await rolesRepository.update({ ...role } as Role);
};

const read = async (id: number) => {
  return await rolesRepository.read(id);
};

const readAll = async (filter: FilterRequestParams) => {
  return await rolesRepository.readAll(filter);
};

const remove = async (id: number) => {
  return await rolesRepository.remove(id);
};

export default {
  create,
  read,
  readAll,
  update,
  remove,
} as RolesService;
