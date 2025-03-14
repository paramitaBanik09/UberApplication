import {Request,Response,Router} from "express"
import { rideDetailsController } from "../../../controllers/rideDetails-controller/rideDetails-controller"
import { rideDetailsService } from "../../../services/rideDetails-service/rideDetails-service"
import { rideDetailsRepo } from "../../../repositories/rideDetails-repo/rideDetails-repo"
import { rideDetailsInput } from "../../../types"
import { UserRepo } from "../../../repositories/user-repo/user-repo"
import { DriverRepo } from "../../../repositories/driver-repo/driver-repo"

export const rideDtlRouter = Router()
const driverRepoObj = new DriverRepo()
const userRepoObj = new UserRepo(driverRepoObj)
const rideRepo = new rideDetailsRepo(userRepoObj,driverRepoObj)
const rideService = new rideDetailsService(rideRepo)
const rideController = new rideDetailsController(rideService)
rideDtlRouter.post("/insertARide",async(req:Request,res:Response)=>{
    await rideController.insertRideDtl(req as rideDetailsInput,res)
})