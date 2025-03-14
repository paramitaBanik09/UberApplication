import { Router } from "express";
import { driverRouter } from "./driver/driver-routes";
import { userRouter } from "./user/user-routes";
import { rideDtlRouter } from "./rideDetails/rideDtl-routes";

export const v1Router = Router();
v1Router.use("/user", userRouter);
v1Router.use("/driver", driverRouter);
v1Router.use("/rideDetails",rideDtlRouter)
