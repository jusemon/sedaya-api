import Joi from 'joi';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { FilterRequestParams, Repository, Response } from '../models/common';
import { Role } from '../models/database';
import HttpStatusCode from '../models/http-status-code';
import { AppError } from '../utils/error';

import { getPool } from './db';

type RolesRepository = Repository<Role>;

const create = async (role: Role) => {
  const sql = 'INSERT INTO roles (name, isAdmin) VALUES (?, ?)';
  const conn = getPool();
  const [response] = await conn.query<ResultSetHeader>(sql, [
    role.name,
    role.isAdmin,
  ]);
  if (response.affectedRows) {
    return { ...role, id: response.insertId };
  }
  return null;
};

const update = async (role: Role) => {
  const sql = 'UPDATE roles SET name = ?, isAdmin = ? WHERE id = ?';
  const conn = getPool();
  const [response] = await conn.query<ResultSetHeader>(sql, [
    role.name,
    role.isAdmin,
    role.id,
  ]);
  if (response.affectedRows) {
    return { ...role };
  }
  return null;
};

const read = async (id: number) => {
  const sql = 'SELECT * FROM roles WHERE id = ?';
  const conn = getPool();
  const [response] = await conn.query<Array<RowDataPacket>>(sql, [id]);
  if (response.length === 0) {
    throw new AppError(
      HttpStatusCode.NOT_FOUND,
      'NOT FOUND',
      `Role for id ${id} not found`
    );
  }
  const [{ queryable: _, ...result }] = response;
  return result;
};

const readAll = async ({ filter, page, pageSize }: FilterRequestParams) => {
  const hasPagination = Number.isInteger(pageSize) && Number.isInteger(page);
  const countSelect = 'SELECT COUNT(*) as totalElements FROM roles';
  const select = 'SELECT * FROM roles';
  const where = filter ? ' WHERE queryable like ?' : '';
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
  const data = results.map<Role>((result: any) => {
    const { queryable: _, ...role } = result;
    return role;
  });

  return {
    data,
    page: page || 0,
    totalElements,
    pageSize: data.length,
  } as Response<Role>;
};

const remove = async (id: number) => {
  const sql = 'DELETE FROM roles WHERE id = ?';
  const conn = getPool();

  await conn.query(sql, [id]);
};

export default {
  create,
  read,
  readAll,
  update,
  remove,
} as RolesRepository;
