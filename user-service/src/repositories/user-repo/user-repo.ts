import { config } from "../../config";
import User from "../../models/user/user.model";
import { RequestRideInputTypes, UserRegisterRequest } from "../../types";
import { GlobalErrorHandler } from "../../utils";
import { errorStructure } from "../../utils/Helper/helperFunction";
import { DriverRepo } from "../driver-repo/driver-repo";
const { logger } = config

export class UserRepo {
    constructor(private readonly driverRepo: DriverRepo) { }
    async register(req: UserRegisterRequest) {
        logger.info("Inside User Register Repository")
        const newUser = {
            name: req?.body?.name,
            email: req?.body?.email,
            phone: req?.body?.phone,
            password: req?.body?.password,
            location: {
                coordinates: req?.body?.location?.coordinates
            }
        }
        const addedUser = new User(newUser)
        const result = await addedUser.save()
        return result
    }

    async findUserById(userId: string) {
        logger.info("Inside User Find Method in repository")
        const user = await User.findById(userId)
        if (!user) {
            logger.error("User not found", userId)
            throw new GlobalErrorHandler(errorStructure("User not found", 404, "User not found", {}))
        }
        return user
    }

    async requestRide(req: RequestRideInputTypes, fare: number, userId: string, requestId: string) {
        logger.info("Inside User Request Ride Repository")
        const { pickupLocation } = req
        const nearbyDrivers = await this?.driverRepo?.findNearbyDrivers(pickupLocation?.coordinates, userId)
        return {
            nearbyDrivers,
            fare
        }
    }
}