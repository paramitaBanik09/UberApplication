import { StatusCodes } from "http-status-codes";
import User from "../../models/user/user.model";
import { DriverRegisterTypes } from "../../types";
import { GlobalErrorHandler } from "../../utils";
import { errorStructure } from "../../utils/Helper/helperFunction";
import Driver from "../../models/driver/driver.model";
import { config } from "../../config";
const { logger } = config

export class DriverRepo {
  async createDriver(driverData: DriverRegisterTypes) {
    const { user, vehicle, license, availability, accountDetails, documents } = driverData;
    logger.info("Creating driver in repository layer");
    const isUserExists = await User.findOne({
      _id: user
    });
    if (!isUserExists) {
      logger.error("User not found", user);
      throw new GlobalErrorHandler(errorStructure("User not found", StatusCodes.BAD_REQUEST, "User not found", {}));
    }
    const isDriverExists = await Driver.findOne({
      user
    });
    if (isDriverExists) {
      logger.error("Driver already exists in Database", user);
      throw new GlobalErrorHandler(errorStructure("Driver already exists", StatusCodes.BAD_REQUEST, "Driver already exists", {}));
    }
    if (license?.expiryDate < new Date()) {
      logger.error("License expired", license);
      throw new GlobalErrorHandler(errorStructure("License expired", StatusCodes.BAD_REQUEST, "License expired", {}));
    }
    if (!vehicle?.licensePlate) {
      logger.error("License plate required", vehicle);
      throw new GlobalErrorHandler(errorStructure("License plate required", StatusCodes.BAD_REQUEST, "License plate required", {}));
    }
    
    const driver = new Driver({
      user,
      vehicle,
      license,
      availability,
      accountDetails,
      documents
    })
    logger.info("Driver creation in process", driver);
    return await driver.save();
  }
}