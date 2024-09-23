export type User = {
  id: string;
  first: string;
  last: string;
  photo: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
};

export type UsersResponse = {
  data: User[];
  prev: number | null;
  next: number | null;
  pages: number | null;
};

export type RolesResponse = {
  data: Role[];
  prev: number | null;
  next: number | null;
  pages: number | null;
};

export type Role = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  isDefault: boolean;
  description: string;
};
