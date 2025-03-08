import { NextFunction, Request, Response, Router } from "express";
import { controllers } from "../../../controllers";
import { repositories } from "../../../repositories";
import { services } from "../../../services";
import { loginRequest, UserRegisterRequest } from "../../../types";

export const userRouter = Router();
const { UserController } = controllers
const { UserService } = services
const { UserRepo } = repositories

const usrRepo = new UserRepo()
const userService = new UserService(usrRepo)
const userController = new UserController(userService)

userRouter.post("/register", async (req: Request, res: Response) => {
  await userController.register(req as UserRegisterRequest, res)
})

userRouter.post("/login", async (req: Request, res: Response) => {
    await userController.login(req as loginRequest, res)
  })