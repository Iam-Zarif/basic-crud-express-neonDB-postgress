import type { Request, Response } from "express"
import { authServices } from "./auth.services";


const loginUser = async (req:Request, res:Response) => {
    

    try {
 const result = await authServices.loginUserIntoDB(req.body)

         res.status(201).json({
           message: "Logged  in sucessfully",
           data: result,
         });
        
    } catch (error:any) {
        res.status(500).json({
          message: error.message,
          error: error,
        });
    }
}

export const authController = {
    loginUser
}