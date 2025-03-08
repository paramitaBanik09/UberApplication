import { StatusCodes } from "http-status-codes";
import { DriverRepo } from "../../repositories/driver-repo/driver-repo";
import { DriverRegisterTypes } from "../../types";
import { GlobalErrorHandler } from "../../utils";
import { errorStructure } from "../../utils/Helper/helperFunction";
import { config } from "../../config";
const { logger } = config
export class DriverService {
  constructor(private readonly driverRepo: DriverRepo) { }

  async registerDriver(req: DriverRegisterTypes) {
    logger.info("Registering driver in service layer", req);
    try {
      const { user, vehicle, license, availability, accountDetails, documents } = req;
      const driver = await this.driverRepo.createDriver({ user, vehicle, license, availability, accountDetails, documents });
      logger.info("Driver registered successfully", driver);
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
}