import type { Request, Response } from "express";
import { authServices } from "./auth.services";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";
import sendResponse from "../../utility/SendResponse";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.loginUserIntoDB(req.body);
    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(201).json({
      message: "Logged  in sucessfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "No refresh token found",
      });
    }

    const decoded = jwt.verify(
      token,
      config.refresh_secret as string,
    ) as JwtPayload;

    const { iat, exp, ...payload } = decoded;

    const newAccessToken = jwt.sign(payload, config.secret as string, {
      expiresIn: "1d",
    });
    sendResponse(res, {
      statusCode: 200,
      message: "Access token refreshed successfully",
      data: newAccessToken,
    });
  } catch (err: any) {
    console.log("JWT ERROR:", err.message);

    return res.status(401).json({
      message: "Invalid refresh token",
      error: err.message,
    });
  }
};

export const authController = {
  loginUser,
  refreshToken,
};
