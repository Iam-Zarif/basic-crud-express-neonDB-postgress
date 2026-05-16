import { pool } from "../../db";
import type { User } from "./user.types";

const createUserIntoDB = async (payload: User) => {
  const { full_name, age, email, password } = payload;
  const result = await pool.query(
    `
        INSERT INTO users ( full_name, age,email, password) VALUES($1,$2,$3,$4)
        RETURNING *
        `,
    [full_name, age, email, password],
  );
  return result;
};

const getUserFromDB = async () => {
  const result = await pool.query(`
        SELECT * FROM users;
        `);
  return result;
};

const getUserDetailFromDB = async (id: number | string) => {
  const result = await pool.query(
    `
    SELECT * FROM users
    WHERE id = $1`,
    [id],
  );
  return result
};

const updateUserFromDB  = async (id:number | string, payload:User) => {

  const { full_name, age, is_active, email} = payload;

  const result = await pool.query(
    `
    UPDATE users SET 
    full_name = COALESCE ($1, full_name),
    age = COALESCE ($2, age),
    is_active =COALESCE ($3, is_active),
    email = COALESCE($4, email)
    WHERE id = $5
    RETURNING *
    `,
    [full_name, age, is_active, email, id],
  );
  return result
}

const deleteUserFromDB = async (id:number | string) => {

  const result = await pool.query(
    `
    DELETE FROM users
    WHERE id = $1;`,
    [id],
  );
  return result
}

export const userService = {
  createUserIntoDB,
  getUserFromDB,
  getUserDetailFromDB,
  updateUserFromDB,
  deleteUserFromDB,
};
