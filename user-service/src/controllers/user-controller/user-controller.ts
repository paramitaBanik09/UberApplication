import { Request, Response } from "express";
import { UserService } from "../../services/user-service/user-service";
import { StatusCodes } from "http-status-codes";
import { UserRegisterRequest } from "../../types";
import { errorResponse, GlobalErrorHandler } from "../../utils";
import Driver from "../../models/driver/driver.model";
import User from "../../models/user/user.model";

export class UserController {
    constructor(private readonly userService: UserService) { }

    async register(req: UserRegisterRequest, res: Response) {
        try {
            const result = await this.userService.register(req,res)
            console.log(result)
            return res.status(StatusCodes.OK).json({
              output: result
            })
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).send(error)
        }
    }

}