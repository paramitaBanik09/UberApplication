import { Request, Response, Router } from "express";
import { controllers } from "../../../controllers";
import { repositories } from "../../../repositories";
import { services } from "../../../services";
import { DriverRegisterRequest } from '../../../types';
import { CalculateService } from "../../../advice/CalculateService";

const { DriverController } = controllers
const { DriverService, UserService } = services
const { DriverRepo, UserRepo } = repositories
const driverRepo = new DriverRepo()
const userRepo = new UserRepo()
const calculateService = new CalculateService()
const userService = new UserService(userRepo, calculateService)
const driverService = new DriverService(driverRepo, userService)
const driverController = new DriverController(driverService)

export const driverRouter = Router();


driverRouter.post("/register", async (req: Request, res: Response) => {
  await driverController.registerDriver(req as DriverRegisterRequest, res);
})