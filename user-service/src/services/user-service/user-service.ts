import { Request, Response } from "express";
import { UserRepo } from "../../repositories/user-repo/user-repo";
import {StatusCodes} from "http-status-codes"

export class UserService{
    constructor(private userRepo: UserRepo){}
    async getUserDtl(req:Request,res:Response) {
        try {
           return await this.userRepo.getUserDtl(req,res)
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                output:"Internal error"
            })
        }
    }
}