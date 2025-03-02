import { Router } from "express";
import { driverRouter } from "./driver/driver-routes";
import { userRouter } from "./user/user-routes";

export const v1Router = Router();
v1Router.use("/user", userRouter);
v1Router.use("/driver", driverRouter);
