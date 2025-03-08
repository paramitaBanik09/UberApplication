import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { GlobalErrorHandler } from "../utils";

export const errorHandeler = (err: GlobalErrorHandler, req: Request, res: Response,next:NextFunction)=>{
   res.status(StatusCodes?.INTERNAL_SERVER_ERROR).json({
    message: err?.message || "Internal Server Error",
    error: err?.message || {}
  });
}