import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../../services/user-service/user-service";
import { UserRegisterRequest } from "../../types";

export class UserController {
    constructor(private readonly userService: UserService) { }

    async register(req: UserRegisterRequest, res: Response) {
        try {
            const result = await this.userService.register(req)
            return res.status(StatusCodes.OK).json({
              output: result
            })
        } catch (error) {
            return res.status(StatusCodes.BAD_REQUEST).send(error)
        }
    }

}