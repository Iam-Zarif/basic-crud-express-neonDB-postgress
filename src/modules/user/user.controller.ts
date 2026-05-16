import type { Request, Response } from "express";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {

  try {
    const result = await userService.createUserIntoDB(req.body)
    console.log(result);

    res.status(201).json({
      message: "Posted Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

const getUser = async (req:Request, res:Response) => {
  
    try {
      const result = await userService.getUserFromDB();
      res.status(200).json({
        message: "Users fetched successfully",
        data: result.rows,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
        error: error,
      });
    }

}

const getUserDetail = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.getUserDetailFromDB(Number(id));
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "User not Found",
      });
    }
    res.status(200).json({
      message: "Dynamic User fetched sucessfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
}

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.updateUserFromDB(Number(id), req.body);
    if (result.rows.length === 0) {
      res.status(404).json({
        message: "User Not Fonud",
      });
    }
    res.status(200).json({
      message: "user updated",
      data: result.rows[0],
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDB(Number(id));

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
}

export const userController = {
  createUser,
  getUser,
  getUserDetail,
  updateUser,
  deleteUser
};