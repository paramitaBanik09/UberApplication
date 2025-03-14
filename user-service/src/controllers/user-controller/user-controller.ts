import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../../services/user-service/user-service";
import { LoginRequest, RequestRideInput, UserRegisterRequest } from "../../types";
import { config } from "../../config"
import { errorStructure, successStructure } from "../../utils/Helper/helperFunction";

const { logger } = config

export class UserController {
    constructor(private readonly userService: UserService) { }

    async register(req: UserRegisterRequest, res: Response) {
        logger.info("Inside User Register Controller")
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

    async login(req: LoginRequest, res: Response) {
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

    async getUserDetails(req: Request, res: Response) {
        try {
            const userDetails = await this.userService?.getUserDetails(req?.params?.userId)
            res?.status(StatusCodes?.OK).json(successStructure("User details fetched successfully", StatusCodes?.OK, "User details fetched successfully", userDetails))
            this.userService?.getAddressFromCoordinets(22.694380,88.454979)
        } catch (error) {
            res.status(error?.statusCodes ?? StatusCodes?.INTERNAL_SERVER_ERROR).json(errorStructure(error?.message ?? "Internal ServerError", error?.statusCodes ?? StatusCodes?.INTERNAL_SERVER_ERROR, error?.message ?? "Internal ServerError"))
        }
    }

    async requestRide(req: RequestRideInput, res: Response) {
        try {
            const result = await this.userService?.requestRide(req)
            res.status(StatusCodes.ACCEPTED).json(successStructure("Request ride successfull", StatusCodes.ACCEPTED, "Request ride successfull", result))
        } catch (error) {
            res.status(error?.statusCodes ?? StatusCodes?.INTERNAL_SERVER_ERROR).json(errorStructure(error?.message ?? "Internal ServerError", error?.statusCodes ?? StatusCodes?.INTERNAL_SERVER_ERROR, error?.message ?? "Internal ServerError"))
        }
    }

}