export type User = {
  readonly id?: number | string;
  full_name: string;
  age: number;
  email: string;
  password: string;
  is_active?: boolean;
};
