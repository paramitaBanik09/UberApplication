import { StatusCodes } from "http-status-codes";
import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import { config } from "../../config";
import User from "../../models/user/user.model";
import { UserRepo } from "../../repositories/user-repo/user-repo";
import { LoginRequest, RequestRideInput, UserRegisterRequest, UserRole } from "../../types";
import { errorResponse, GlobalErrorHandler } from "../../utils";
import { errorStructure } from "../../utils/Helper/helperFunction";
import { CalculateService } from "../../advice/CalculateService";
import { DriverRepo } from "../../repositories/driver-repo/driver-repo";

const { server_config, logger } = config
const { JWT_ACCESS_TOKEN_EXPIRATION, JWT_SECRET_KEY } = server_config

export class UserService {
    constructor(private userRepo: UserRepo, private readonly calculateService: CalculateService) { }
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

    async login(req: LoginRequest) {
        try {
            const { email, password } = req.body
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


    async requestRide(req: RequestRideInput) {
        logger.info("Inside User Request Ride Service")
        const { pickupLocation, dropOffLocation, messageForDriver = "", modeOfPayment, vehicleType, userId = "67cd4ccd12b4ac047063d9e5" } = req.body
        if (!pickupLocation || !dropOffLocation || !modeOfPayment || !vehicleType) {
            throw new GlobalErrorHandler(errorStructure("Please enter all the mandatory fields to request a ride", StatusCodes.BAD_REQUEST, "Bad user Request"))
        }
        try {
            const calculatedDistance = this.calculateService.calculateDistanceInKm(pickupLocation?.coordinates, dropOffLocation?.coordinates)
            const calculatedFare = this.calculateService.calculateFare(calculatedDistance, vehicleType)
            return this.userRepo.requestRide(req?.body, calculatedFare, userId)
        } catch (error) {
            throw new GlobalErrorHandler(errorStructure(error?.message ?? "Internal ServerError", error?.statusCodes ?? StatusCodes?.INTERNAL_SERVER_ERROR, error?.message ?? "Internal ServerError"))
        }
    }

    async addUserRole(userId: string, newRole: UserRole) {
        logger.info("Inside User Add Role Service")
        try {
            if (newRole !== UserRole.RIDER && newRole !== UserRole.DRIVER) {
                throw new GlobalErrorHandler(errorStructure("Invalid user role", StatusCodes.BAD_REQUEST, "Bad user Request"))
            }
            const isUserExists = await this.userRepo?.findUserById(userId);
            if (!isUserExists) {
                throw new GlobalErrorHandler(errorStructure("User not found", StatusCodes.NOT_FOUND, "User not found"))
            }
            const { _id, __v, ...userDetails } = isUserExists.toObject ? isUserExists.toObject() : isUserExists;;
            const updatedUser = await User.findByIdAndUpdate(userId, {
                ...userDetails,
                role: [...isUserExists.role, newRole]
            }, { new: true })
            logger.info("User role updated successfully", updatedUser)
            if (!updatedUser) {
                throw new GlobalErrorHandler(errorStructure("Unable to update user role", StatusCodes.INTERNAL_SERVER_ERROR, "Unable to update user role"))
            }
            return true
        } catch (error) {
            throw new GlobalErrorHandler(errorStructure(error?.message ?? "Internal ServerError", error?.statusCodes ?? StatusCodes?.INTERNAL_SERVER_ERROR, error?.message ?? "Internal ServerError"))
        }
    }

    async getUserDetails(userId: string) {
        try {
            const user = await this.userRepo?.findUserById(userId); if (!user) {
                throw new GlobalErrorHandler(errorStructure("User not found", StatusCodes.NOT_FOUND, "User not found"))
            }
            return user
        } catch (error) {
            throw new GlobalErrorHandler(errorStructure(error?.message ?? "Internal ServerError", error?.statusCodes ?? StatusCodes?.INTERNAL_SERVER_ERROR, error?.message ?? "Internal ServerError"))
        }
    }
}