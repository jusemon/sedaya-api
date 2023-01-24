import Joi from "joi";

export type Response<T> = {
  data: ReadonlyArray<T>;
  page: number;
  pageSize: number;
  totalElements: number;
};

export type FilterRequestParams = {
  page?: number;
  pageSize?: number;
  filter?: string | number | Date;
};

export const filterRequestParamsSchema = Joi.object<FilterRequestParams>({
  page: Joi.number().positive().integer().default(0),
  pageSize: Joi.number().positive().integer(),
  filter: Joi.alt().try(Joi.string(), Joi.number(), Joi.date()),
});


export type Repository<T> = {
  create: (entity: T) => Promise<T>;
  update: (entity: T) => Promise<T>;
  read: (id: number) => Promise<T>;
  readAll: (filter?: FilterRequestParams) => Promise<Response<T>>;
  remove: (id: number) => Promise<void>;
};

export type Service<TPostRequest, TPutRequest, TResponse> = {
  create: (dto: TPostRequest) => Promise<TResponse>;
  update: (dto: TPutRequest) => Promise<TResponse>;
  read: (id: number) => Promise<TResponse>;
  readAll: (filter?: FilterRequestParams) => Promise<Response<TResponse>>;
  remove: (id: number) => Promise<void>;
};
