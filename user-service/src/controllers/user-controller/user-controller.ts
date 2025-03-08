import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../../services/user-service/user-service";
import { loginRequest, UserRegisterRequest } from "../../types";

export class UserController {
    constructor(private readonly userService: UserService) { }

    async register(req: UserRegisterRequest, res: Response) {
        try {
            const result = await this.userService.register(req)
            res.status(StatusCodes.OK).json({
              output: result
            })
        } catch (error) {
            console.log("From catch block of controller")
             res.status(StatusCodes.CONFLICT).json({
                error
             })
        }
    }

    async login(req:loginRequest,res:Response){
        try {
            const result = await this.userService.login(req)
            res.status(StatusCodes.OK).json({
              output: result
            })
        } catch (error) {
             res.status(StatusCodes.CONFLICT).json({
                error
             })
        }
    }

}