import bcrypt from "bcrypt";
import { pool } from "../../db";
import type { Login } from "./auth.type";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: Login) => {
  const { email, password } = payload;

  const userData = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );

  if (userData.rows.length === 0) {
    throw new Error("User not found");
  }

  const user = userData.rows[0];

  const comaprePassword = await bcrypt.compare(password, user.password);

  if (!comaprePassword) {
    throw new Error("Invalid Credintials");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret as string, {expiresIn:"1d"});
  delete user.password
  return {user,accessToken}
};

export const authServices = {
  loginUserIntoDB,
};
