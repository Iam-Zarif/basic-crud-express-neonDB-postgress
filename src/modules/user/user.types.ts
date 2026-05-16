export type User = {
  readonly id?: number | string;
  full_name: string;
  age: number;
  email: string;
  password: unknown;
  is_active?: boolean;
};
