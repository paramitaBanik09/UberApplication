import { config } from './../../config';
import { DriverService } from "../../services/driver-service/driver-service";
import { AcceptRideRequest, DriverRegisterRequest } from "../../types";
import { errorStructure, successStructure } from '../../utils/Helper/helperFunction';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DriverRepo } from '../../repositories/driver-repo/driver-repo';

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

  async acceptRide(req:AcceptRideRequest,res:Response){
    try {
      //const {userIdOfDriver,distance,dropOffLocation,pickupLocation,fare,vehicleType} = req?.body
      const currentLocationOfDriver = await this.driverService.acceptRideRequest(req)
      if(currentLocationOfDriver){
        res.status(StatusCodes.OK).json({
          currentLocationOfDriver
        })
      }
    } catch (error) {
      logger.error("Error acceping any ride request", error);
      res.status(error?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR).json(errorStructure(error?.message, error?.statusCode, error?.message, error))
    }
  }
  
}