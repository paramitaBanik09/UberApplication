import { Response } from "express";
import { rideDetailsInput } from "../../types";
import { rideDetailsService } from "../../services/rideDetails-service/rideDetails-service";
import { GlobalErrorHandler } from "../../utils";
import { errorStructure } from "../../utils/Helper/helperFunction";
import { StatusCodes } from "http-status-codes";

export class rideDetailsController{
    constructor(private readonly rideService:rideDetailsService){}
    async insertRideDtl(req:rideDetailsInput,res:Response){
        try {
            const insertedRide = await this.rideService.dataInsertionOfRide(req)
            if(!insertedRide){
                throw new GlobalErrorHandler(errorStructure("Internal server error",StatusCodes.INTERNAL_SERVER_ERROR,"Internal server error"))
            }
            res.status(StatusCodes.OK).json({
                insertedRide
            })
        } catch (error) {
            res.status(error?.statusCodes ?? StatusCodes?.INTERNAL_SERVER_ERROR).json(errorStructure(error?.message ?? "Internal ServerError", error?.statusCodes ?? StatusCodes?.INTERNAL_SERVER_ERROR, error?.message ?? "Internal ServerError"))
        }
    }
}