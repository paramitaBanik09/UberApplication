import { StatusCodes } from "http-status-codes";
import User from "../../models/user/user.model";
import { DriverRegisterTypes, UserRole } from "../../types";
import { GlobalErrorHandler } from "../../utils";
import { errorStructure } from "../../utils/Helper/helperFunction";
import Driver from "../../models/driver/driver.model";
import { config } from "../../config";
import mongoose from "mongoose";
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

  async findNearbyDrivers(location: [number, number], userId: string, vehicleType:string) {
    logger.info("Finding nearby drivers in repository layer");
    const [lng, lat] = location
    /*  const nearbyDrivers = await User.find({
       location: {
         $near: {
           $geometry: {
             type: "Point",
             coordinates: [lng, lat]
           },
           $maxDistance: 1000
         }
       },
       role: "driver" ,
       _id: { $ne: userId }
     },{
       password: 0,
       __v: 0,
       _id: 0,
       role:0,
       verificationStatus: 0,
       location: 0,
       createdAt: 0,
       updatedAt: 0,
     }) */
    /* const nearbyDrivers = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          maxDistance: 1000,
          spherical: true,
          query: {
            role: UserRole.DRIVER,
            _id: { $ne: new mongoose.Types.ObjectId(userId) }
          }
        }
      },
      {
        $lookup: {
          from: 'Driver',
          localField: '_id',
          foreignField: 'user',
          as: 'driverDetails'
        }
      },
      {
        $project: {
          password: 0,
          __v: 0,
          verificationStatus: 0,
          location: 0,
          createdAt: 0,
          updatedAt: 0,
          
        }
      }
    ]) */
    const nearbyDrivers = await User.aggregate([
      //all users who are within 1km from user's current location
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat],
          },
          distanceField: "distance",
          maxDistance: 1000,
          /* spherical: true, */
        }
      },
      // here we are joining user table with driver table to get all the details of the driver
      {
        $lookup: {
          from: 'drivers',
          localField: '_id',
          foreignField: 'user',
          as: 'driverDetails'
        }
      },
      {
        $match: {
          "driverDetails.availability.status": "online",
          _id: { $ne: new mongoose.Types.ObjectId(userId) },
          "driverDetails.vehicle.type": vehicleType?.toLowerCase()
        }
      },
      {
        $project: {
          password: 0,
          _id :0,
          role:0,
          verificationStatus:0,
          location:0,
          createdAt:0,
          updatedAt:0,
          __v:0,
          "driverDetails._id":0,
          "driverDetails.user":0,
          "driverDetails.availability":0,
          "driverDetails.documents":0,
          "driverDetails.accountDetails":0,
          "driverDetails.stats":0,
          "driverDetails.earnings":0,
          "driverDetails.createdAt":0,
          "driverDetails.updatedAt":0,
          "driverDetails.license.expiryDate":0,
          "driverDetails.license.state":0,
          "driverDetails.vehicle.make":0,
          "driverDetails.vehicle.color":0,
          "driverDetails.vehicle.year":0,
          "driverDetails.ratings.count":0,
          "driverDetails.ratings.reviews":0,
          "driverDetails.serviceAreas":0,
          "driverDetails.__v":0,
        }
      }
    ])
    return nearbyDrivers
  }
  async findCurrentLocationOfDriver(userIdOfDriver:string){
    const userProfile = await Driver.aggregate([{
      $lookup:{
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
      }
    },
      {
        $match: {
          "userDetails._id": { $eq: new mongoose.Types.ObjectId(userIdOfDriver) }
        }
      }
  ])
  console.log(userProfile)
  return userProfile
  }

  async findDriverByDriverID(driverID:string){
    const findDriver = await Driver.findById(driverID)
    if(!findDriver){
      throw new GlobalErrorHandler(errorStructure("Invalid driver ID",StatusCodes.CONFLICT,"Invalid driver ID"))
    }
    return findDriver
  }
}
