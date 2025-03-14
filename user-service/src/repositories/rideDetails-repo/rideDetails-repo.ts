import { StatusCodes } from "http-status-codes";
import { Ride } from "../../models/rideDetails/riderDetails.model";
import { ModeOfPayment, rideDetailsInput } from "../../types";
import { GlobalErrorHandler } from "../../utils";
import { errorStructure } from "../../utils/Helper/helperFunction";
import { UserRepo } from "../user-repo/user-repo";
import { DriverRepo } from "../driver-repo/driver-repo";

export class rideDetailsRepo{
    constructor(private readonly userRepo:UserRepo,private readonly driverRepo:DriverRepo){}
    async dataInsertionOfRide(req:rideDetailsInput){
        const {driver,driverRating,dropOffLocation,fare,paymentMode,pickupLocation,requestId,rider,totalDistance,vehicleType} = req?.body
            //Rider validation
            const findRider = await this.userRepo.findUserById(rider)
            //Drivervalidation
            const findDriver = await this.driverRepo.findDriverByDriverID(driver)
            //Validation of payment mode
            console.log("paymentMode",typeof paymentMode,"mode of payment:",typeof ModeOfPayment.CARD.toString())
            if(paymentMode.toLowerCase()!==ModeOfPayment.CARD.toString() && paymentMode.toLowerCase()!==ModeOfPayment.CASH.toString() && paymentMode.toLowerCase()!==ModeOfPayment.UPI.toString()){
                throw new GlobalErrorHandler(errorStructure("Please provide a valid payment mode",StatusCodes.BAD_REQUEST,"Please provide a valid payment mode"))
            }
        const inputOfRideDtl ={
            driver,
            driverRating,
            dropOffLocation,
            fare,
            paymentMode:paymentMode.toLowerCase(),
            pickupLocation,
            requestId,
            rider,
            totalDistance,
            vehicleType
        }
        const newRide = new Ride(inputOfRideDtl)
        return await newRide.save()
    }
}