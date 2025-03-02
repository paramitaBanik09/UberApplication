import { Request, Response } from "express";
import { UserService } from "../../services/user-service/user-service";
import { StatusCodes } from "http-status-codes";

export class UserController{
    constructor(private readonly userService : UserService){}

    async getUserDtl(req:Request,res:Response){
        try {
           const output = await this.userService.getUserDtl(req,res)
           if(output){
            res.status(StatusCodes.OK).json({
                output:"Success"
            })
           }
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                            output:"Internal error"
                        })
        }
    }

}