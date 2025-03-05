import { Request, Response } from "express";
import { UserRepo } from "../../repositories/user-repo/user-repo";
import {StatusCodes} from "http-status-codes"
import { errorResponse, GlobalErrorHandler } from "../../utils";
import User from "../../models/user/user.model";
import { UserRegisterRequest } from "../../types";

export class UserService{
    constructor(private userRepo: UserRepo){}
    async register(req:UserRegisterRequest,res:Response) {
        try {
            console.log("Service1")
            const { email, location, name, password, phone } = req?.body
            if (!email || !name || !password || !phone) {
                errorResponse.message = "Please enter valid credentials to register yourself"
                errorResponse.statusCode = StatusCodes.BAD_REQUEST
                errorResponse.error.stack = {
                    message: "Please enter valid credentials to register yourself",
                    statusCode: StatusCodes.BAD_REQUEST,
                    error: "Bad user Request"
                }
                throw new GlobalErrorHandler(errorResponse)
            }
            //UserAccount validation
            else{
            const findUser = await User.findOne({
                email:req?.body?.email
            })
            console.log("Service2")
            if(findUser){
                errorResponse.message = "User account already exist"
                errorResponse.statusCode = StatusCodes.BAD_REQUEST
                errorResponse.error.stack = {
                    message: "User account already exist",
                    statusCode: StatusCodes.BAD_REQUEST,
                    error: "Bad user Request"
                }
                throw new GlobalErrorHandler(errorResponse)
            }
            console.log("Service3")
            console.log(await this.userRepo.register(req,res))

            return 1
         } // await this.userRepo.register(req,res)
            
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                output:"Internal error"
            })
        }
    }
}