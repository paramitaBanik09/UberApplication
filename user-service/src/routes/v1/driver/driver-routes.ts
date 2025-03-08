import { Request, Response, Router } from "express";
import { controllers } from "../../../controllers";
import { repositories } from "../../../repositories";
import { services } from "../../../services";
import { DriverRegisterRequest } from '../../../types';

const { DriverController } = controllers
const { DriverService } = services
const { DriverRepo } = repositories
const driverRepo = new DriverRepo()
const driverService = new DriverService(driverRepo)
const driverController = new DriverController(driverService)

export const driverRouter = Router();


driverRouter.post("register", async (req: Request, res: Response) => {
  await driverController.registerDriver(req as DriverRegisterRequest);
})