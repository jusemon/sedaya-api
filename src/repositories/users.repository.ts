import Joi from 'joi';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { FilterRequestParams, Repository, Response } from '../models/common';
import { User } from '../models/database';
import HttpStatusCode from '../models/http-status-code';
import { AppError } from '../utils/error';

import { getPool } from './db';

type UserRepository = Repository<User>;

const create = async (user: User) => {
  const sql =
    'INSERT INTO users (name, firstName, lastName, email, roleId) VALUES (?, ?, ?, ?, ?)';
  const conn = getPool();
  const [response] = await conn.query<ResultSetHeader>(sql, [
    user.name,
    user.firstName,
    user.lastName,
    user.email,
    user.roleId,
  ]);
  if (response.affectedRows) {
    return { ...user, id: response.insertId };
  }
  return null;
};

const update = async (user: User) => {
  const sql =
    'UPDATE users SET name = ?, firstName = ?, lastName = ?, email = ?, roleId = ? WHERE id = ?';
  const conn = getPool();
  const [response] = await conn.query<ResultSetHeader>(sql, [
    user.name,
    user.firstName,
    user.lastName,
    user.email,
    user.roleId,
    user.id,
  ]);
  if (response.affectedRows) {
    return { ...user };
  }
  return null;
};

const read = async (id: number) => {
  const sql = `
    SELECT U.*, R.name as roleName, R.isAdmin, R.createdOn as roleCreatedOn, R.updatedOn as roleUpdatedOn
    FROM users U
    INNER JOIN roles R on U.roleId = R.id
    WHERE U.id = ?
  `;
  const conn = getPool();
  const [results] = await conn.query<Array<RowDataPacket>>(sql, [id]);
  if (results.length === 0) {
    throw new AppError(
      HttpStatusCode.NOT_FOUND,
      'NOT FOUND',
      `User for id ${id} not found`
    );
  }
  const [result] = results.map<User>((user) => ({
    id: user.id,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    roleId: user.roleId,
    createOn: user.createOn,
    updateOn: user.updateOn,
    role: {
      id: user.roleId,
      name: user.roleName,
      createOn: user.roleCreatedOn,
      updateOn: user.roleUpdatedOn,
      isAdmin: user.isAdmin,
    },
  }));

  return result;
};

const readAll = async ({ filter, page, pageSize }: FilterRequestParams) => {
  const hasPagination = Number.isInteger(pageSize) && Number.isInteger(page);
  const countSelect = 'SELECT COUNT(*) as totalElements FROM users as U';
  const select = `
    SELECT U.*, R.name as roleName, R.isAdmin, R.createdOn as roleCreatedOn, R.updatedOn as roleUpdatedOn
    FROM users U
    INNER JOIN roles R on U.roleId = R.id
    WHERE U.id = ?
  `;
  const where = filter ? ' WHERE U.queryable like ?' : '';
  const pagination = hasPagination ? ' LIMIT ? OFFSET ?' : '';

  const conn = getPool();

  const [[{ totalElements }]] = await conn.query<Array<RowDataPacket>>(
    countSelect + where,
    [...(filter ? [`%${filter}%`] : [])]
  );
  const [results] = await conn.query<Array<RowDataPacket>>(
    select + where + pagination,
    [
      ...(filter ? [`%${filter}%`] : []),
      ...(hasPagination ? [pageSize!, page! * pageSize!] : []),
    ]
  );
  const data = results.map<User>((res: any) => ({
    id: res.id,
    name: res.name,
    firstName: res.firstName,
    lastName: res.lastName,
    email: res.email,
    roleId: res.roleId,
    createOn: res.createOn,
    updateOn: res.updateOn,
    role: {
      id: res.roleId,
      name: res.roleName,
      createOn: res.roleCreatedOn,
      updateOn: res.roleUpdatedOn,
      isAdmin: res.isAdmin,
    },
  }));

  return {
    data,
    page: page || 0,
    totalElements,
    pageSize: data.length,
  } as Response<User>;
};

const remove = async (id: number) => {
  const sql = 'DELETE FROM users WHERE id = ?';
  const conn = getPool();

  await conn.query(sql, [id]);
};

export default {
  create,
  read,
  readAll,
  update,
  remove,
} as UserRepository;
