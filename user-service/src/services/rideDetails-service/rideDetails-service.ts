import { StatusCodes } from "http-status-codes";
import { rideDetailsInput } from "../../types";
import { errorResponse, GlobalErrorHandler } from "../../utils";
import { errorStructure } from "../../utils/Helper/helperFunction";
import { rideDetailsRepo } from "../../repositories/rideDetails-repo/rideDetails-repo";

export class rideDetailsService{
    constructor(private readonly rideRepo:rideDetailsRepo){}
    async dataInsertionOfRide(req:rideDetailsInput){
        try {
            const {driver,driverRating,dropOffLocation,fare,paymentMode,pickupLocation,requestId,rider,totalDistance,vehicleType} = req?.body
            if(!driver || !dropOffLocation || !fare|| !paymentMode|| !pickupLocation|| !requestId|| !rider|| !totalDistance|| !vehicleType){
                throw new GlobalErrorHandler(errorStructure("Please provide the mandetry details of ride",StatusCodes.BAD_REQUEST,"Please provide the mandetry details of ride"))
            }
            return await this.rideRepo.dataInsertionOfRide(req)
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
}