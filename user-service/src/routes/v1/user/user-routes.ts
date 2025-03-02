import { NextFunction, Request, Response, Router } from "express";
import { controllers } from "../../../controllers";
import { services } from "../../../services";
import { repositories } from "../../../repositories";

export const userRouter = Router();
const {UserController} = controllers
const {UserService} = services
const {UserRepo} = repositories

const usrRepo = new UserRepo()
const userService = new UserService(usrRepo)
const userController = new UserController(userService)

userRouter.get("/userDetails",async(req:Request,res:Response,next:NextFunction)=>{
   await userController.getUserDtl(req,res)
})