import { Request, Response } from "express";
import User from "../../models/user/user.model";
import { UserRegisterRequest } from "../../types";

export class UserRepo{
    async register(req:UserRegisterRequest,res:Response){
        //try {
            console.log("Repo1")
            const newUser= {
                name: req?.body?.name,
                email: req?.body?.email,
                phone: req?.body?.phone,
                password: req?.body?.password,
                location: {
                coordinates: req?.body?.location?.coordinates
                }
            }
            const addedUser = new User(newUser)
            console.log("Repo2")
            const result = await addedUser.save()
            return result
        // } catch (error) {
        //     throw new error
        // }
    }
}