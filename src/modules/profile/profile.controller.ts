import type { Request, Response } from "express";
import { profileService } from "./profile.service";


const createProfile = async (req:Request, res:Response) => {

    try {
        const result = await profileService.createProfileintoDB(req.body)

        res.status(201).json({
            message:"profile created sucessfully",
            data:result.rows[0]
        })
        
    } catch (error:any) {
        res.status(500).json({
          message: error.message,
          error: error,
        });
    }
    
}

export const profileController = {
    createProfile
}