import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../../models/user/user.model";
import { UserRepo } from "../../repositories/user-repo/user-repo";
import { UserRegisterRequest } from "../../types";
import { errorResponse, GlobalErrorHandler } from "../../utils";

export class UserService {
    constructor(private userRepo: UserRepo) { }
    async register(req: UserRegisterRequest) {
        try {
            const { email, location, name, password, phone } = req.body
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
            else {
                const findUser = await User.findOne({
                    email: req?.body?.email
                })
                if (findUser) {
                    errorResponse.message = "User account already exist"
                    errorResponse.statusCode = StatusCodes.BAD_REQUEST
                    errorResponse.error.stack = {
                        message: "User account already exist",
                        statusCode: StatusCodes.BAD_REQUEST,
                        error: "Bad user Request"
                    }
                    throw new GlobalErrorHandler(errorResponse)
                }
                const createdUser = await this.userRepo?.register(req)
                return createdUser
            } 

        } catch (error) {
            errorResponse.message = "User account already exist"
            errorResponse.statusCode = StatusCodes.BAD_REQUEST
            errorResponse.error.stack = {
                message: "User account already exist",
                statusCode: StatusCodes.BAD_REQUEST,
                error: "Bad user Request"
            }
            throw new GlobalErrorHandler(errorResponse)
        }
    }
}