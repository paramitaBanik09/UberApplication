import { StatusCodes } from "http-status-codes";
import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "../../config";
import User from "../../models/user/user.model";
import { UserRepo } from "../../repositories/user-repo/user-repo";
import { loginRequest, UserRegisterRequest } from "../../types";
import { errorResponse, GlobalErrorHandler } from "../../utils";
import { errorStructure } from "../../utils/Helper/helperFunction";

const { server_config, logger } = config
const { JWT_ACCESS_TOKEN_EXPIRATION, JWT_SECRET_KEY } = server_config

export class UserService {
    constructor(private userRepo: UserRepo) { }
    async register(req: UserRegisterRequest) {
        logger.info("Inside User Register Service")
        try {
            const { email, location, name, password, phone } = req.body
            if (!email || !name || !password || !phone || !location) {
                throw new GlobalErrorHandler(errorStructure("Please enter valid credentials to register yourself", StatusCodes.BAD_REQUEST, "Bad user Request"))
            }
            //UserAccount validation
            else {
                const findUser = await User.findOne({
                    email: req?.body?.email
                })
                if (findUser) {
                    throw new GlobalErrorHandler(errorStructure("User account already exist", StatusCodes.BAD_REQUEST, "Bad user Request"))
                }
                const createdUser = await this.userRepo?.register(req)
                return createdUser
            }

        } catch (error) {
            errorResponse.message = error?.message || "Internal server error"
            errorResponse.statusCode = error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
            errorResponse.error.stack = {
                message: error?.message || "Internal server error",
                statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
                error: "Bad user Request"
            }
            throw new GlobalErrorHandler(errorResponse)
        }
    }

    async login(req: loginRequest) {
        try {
            const { email, password } = req?.body
            if (!email || !password) {
                throw new GlobalErrorHandler(errorStructure("Please enter valid credentials to login yourself", StatusCodes.BAD_REQUEST, "Bad user Request"))
            }
            const findUser = await User.findOne({
                email
            })
            if (!findUser) {
                throw new GlobalErrorHandler(errorStructure("User not found", StatusCodes.NOT_FOUND, `User not found with this email ${email}`))
            }
            const isPasswordMatch = await findUser.comparePassword(password, findUser?.password)
            if (!isPasswordMatch) {
                throw new GlobalErrorHandler(errorStructure("Invalid password!!! PLease enter a valid password", StatusCodes.BAD_REQUEST, `Entered password is not assosiated with this email ${email}`))
            }

            const accessToken = await this.generateToken({ _id: findUser?.id, email: findUser?.email })
            if (!accessToken) {
                throw new GlobalErrorHandler(errorStructure("Unable to generate access token. Hence youcan't access ou account", StatusCodes.INTERNAL_SERVER_ERROR, `Error occured while creating the access token`))
            }
            return {
                accessToken,
                user: findUser
            }

        } catch (error) {
            errorResponse.message = error?.message || "Internal server error"
            errorResponse.statusCode = error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
            errorResponse.error.stack = {
                message: error?.message || "Internal server error",
                statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
                error: "Bad user Request"
            }
            throw new GlobalErrorHandler(errorResponse)
        }
    }

    async generateToken(
        user: {
            _id: Types.ObjectId,
            email: string
        }
    ) {
        const getTokenExpiration = (): number => Number(JWT_ACCESS_TOKEN_EXPIRATION) ?? 15 * 60

        if (!JWT_SECRET_KEY) {
            throw new GlobalErrorHandler(errorStructure("Invalid JWT SECRECT key", StatusCodes.CONFLICT, `Please enter valid JWT secret key`))
        }
        const accessToken = jwt.sign({
            userId: user?._id,
            email: user?.email
        },
            Buffer.from(JWT_SECRET_KEY || ''),
            {
                expiresIn: "1h",
                // httpOnly:true
            } as SignOptions

        )
        return accessToken

    }
}