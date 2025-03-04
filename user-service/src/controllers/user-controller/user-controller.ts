import { Request, Response } from "express";
import { UserService } from "../../services/user-service/user-service";
import { StatusCodes } from "http-status-codes";
import { UserRegisterRequest } from "../../types";
import { errorResponse, GlobalErrorHandler } from "../../utils";

export class UserController {
    constructor(private readonly userService: UserService) { }

    async getUserDtl(req: UserRegisterRequest, res: Response) {
        try {
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
            const output = await this.userService.getUserDtl(req, res)
            if (output) {
                res.status(StatusCodes.OK).json({
                    output: "Success"
                })
            }
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).send(error)
        }
    }

}