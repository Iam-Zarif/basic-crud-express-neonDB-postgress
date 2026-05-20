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
    role: user.role,
    email: user.email,
    name: user.name,
  };

  const accessToken = jwt.sign(jwtPayload, config.secret as string, {expiresIn:"1d"});
   const refreshToken = jwt.sign(jwtPayload, config.refresh_secret as string, {
     expiresIn: "7d",
   });
  delete user.password
  return {user,accessToken,refreshToken}
};

const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, config.refresh_secret as string);
};

const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, config.secret as string, {
    expiresIn: "1d",
  });
};

const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, config.refresh_secret as string, {
    expiresIn: "7d",
  });
};


export const authServices = {
  loginUserIntoDB,
  generateRefreshToken,
  verifyRefreshToken,
  generateAccessToken,
};
