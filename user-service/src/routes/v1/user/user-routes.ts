import { Request, Response, Router } from "express";
import { config } from "../../../config";
import { controllers } from "../../../controllers";
import { repositories } from "../../../repositories";
import { services } from "../../../services";
import { LoginRequest, RequestRideInput, UserRegisterRequest } from "../../../types";
import { CalculateService } from "../../../advice/CalculateService";

export const userRouter = Router();
const { UserController } = controllers
const { UserService } = services
const { UserRepo,DriverRepo } = repositories
const { logger } = config

const calculateService = new CalculateService()
const driverRepo = new DriverRepo()
const usrRepo = new UserRepo(driverRepo)
const userService = new UserService(usrRepo, calculateService)
const userController = new UserController(userService)

userRouter.post("/register", async (req: Request, res: Response) => {
  logger.info("Inside User Register Route")
  await userController.register(req as UserRegisterRequest, res)
})

userRouter.post("/login", async (req: Request, res: Response) => {
  await userController.login(req as LoginRequest, res)
})

userRouter.get("/:userId", async (req: Request, res: Response) => {
  await userController?.getUserDetails(req, res)
})

userRouter.post("/requestRide", async (req: Request, res: Response) => {
  await userController?.requestRide(req as RequestRideInput, res)
})