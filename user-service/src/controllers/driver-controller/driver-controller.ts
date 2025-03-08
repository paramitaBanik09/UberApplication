import { config } from './../../config';
import { DriverService } from "../../services/driver-service/driver-service";
import { DriverRegisterRequest } from "../../types";
import { errorStructure, successStructure } from '../../utils/Helper/helperFunction';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const { logger } = config

export class DriverController {
  constructor(private readonly driverService: DriverService) { }
  async registerDriver(req: DriverRegisterRequest, res: Response) {
    try {
      const driver = await this.driverService.registerDriver(req?.body);
      res.status(StatusCodes.CREATED).json(successStructure("Driver registered successfully", StatusCodes?.CREATED, "Driver registered successfully", driver));
    } catch (error) {
      logger.error("Error registering driver", error);
      res.status(error?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json(errorStructure(error?.message, error?.statusCode, error?.message, error))
    }
  }
}