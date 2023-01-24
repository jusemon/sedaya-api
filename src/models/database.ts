export type Role = {
  id: number;
  name: string;
  isAdmin: boolean;

  createOn: Date;
  updateOn?: Date;
  queryable?: string;
};

export type Auth = {
  id: number;
  password: string;
  expiration: Date;

  createOn: Date;
  updateOn?: Date;
};

export type User = {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  role?: Role;

  createOn: Date;
  updateOn?: Date;
  queryable?: string;
};
