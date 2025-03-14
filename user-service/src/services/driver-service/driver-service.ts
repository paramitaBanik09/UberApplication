import { StatusCodes } from "http-status-codes";
import { DriverRepo } from "../../repositories/driver-repo/driver-repo";
import { AcceptRideRequest, DriverRegisterTypes, UserRole } from "../../types";
import { GlobalErrorHandler } from "../../utils";
import { errorStructure } from "../../utils/Helper/helperFunction";
import { config } from "../../config";
import { UserService } from "../user-service/user-service";
const { logger } = config
export class DriverService {
  constructor(private readonly driverRepo: DriverRepo, private readonly userService: UserService) { }

  async registerDriver(req: DriverRegisterTypes) {
    logger.info("Registering driver in service layer", req);
    try {
      const { user, vehicle, license, availability, accountDetails, documents } = req;
      if (!user || !vehicle || !license || !accountDetails || !documents) {
        throw new GlobalErrorHandler(errorStructure("Please provide all required fields", StatusCodes.BAD_REQUEST, "Bad Request"));
      }
      const driver = await this.driverRepo.createDriver({ user, vehicle, license, availability, accountDetails, documents });
      logger.info("Driver registered successfully", driver);
      if (driver) {
        logger.info("Changing User role from Rider to Driver");
        const isUserUpdated = await this?.userService?.addUserRole(user, UserRole.DRIVER);
        if (!isUserUpdated) {
          logger.error("User role not updated", user);
          throw new GlobalErrorHandler(errorStructure("User role not updated", StatusCodes.BAD_REQUEST, "Bad Request"));
        }
      }
      return driver;
    } catch (error) {
      if (error?.error?.statusCode === StatusCodes.BAD_REQUEST) {
        logger.error("Bad request error", error);
        throw new GlobalErrorHandler(errorStructure(error?.message, error?.statusCode, error?.message, {
          message: error?.message,
          statusCode: error?.statusCode,
          stack: error?.stack
        }));
      }
      throw new GlobalErrorHandler(errorStructure(error?.message, StatusCodes.INTERNAL_SERVER_ERROR, error?.message, error));
    }
  }

  async acceptRideRequest(req:AcceptRideRequest){
    const {userIdOfDriver,dropOffLocation,pickupLocation,fare,vehicleType} = req?.body
    return await this.driverRepo.findCurrentLocationOfDriver(req?.params.id)
  }

}