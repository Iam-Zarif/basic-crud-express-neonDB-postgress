import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import config from "../config";
import { pool } from "../db";

const auth = (...roles:any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("Roles",roles)
    try {
      const token = req.headers.authorization;
  


      if (!token) {
        return res.status(401).json({
          message: "Not Authorized",
        });
      }

      const decoded = jwt.verify(token, config.secret as string) as JwtPayload;



      if (!decoded.email) {
        return res.status(401).json({
          message: "Invalid token: email not found",
        });
      }

      const userData = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [decoded.email],
      );

      console.log("Userdata" , userData.rows )

      const user = userData.rows[0];

      if (!user) {
        return res.status(404).json({
          message: "User not Found",
        });
      }

      if (user.is_active === false) {
        return res.status(403).json({
          message: "Request Forbidden",
        });
      }
      if(roles.length && !roles.includes(user.role)){
        return res.status(403).json({
          message: "Request Forbidden",
        });
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
};

export default auth;
