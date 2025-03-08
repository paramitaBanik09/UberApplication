import { NextFunction, Request, Response } from "express";
import {errorResponse, GlobalErrorHandler} from "../utils"
import { StatusCodes } from "http-status-codes";

export const errorHandeler = (err: GlobalErrorHandler, req: Request, res: Response,next:NextFunction)=>{
   res.status(StatusCodes?.INTERNAL_SERVER_ERROR).json({
    message: err?.message || "Internal Server Error",
    error: err?.message || {}
  });
}