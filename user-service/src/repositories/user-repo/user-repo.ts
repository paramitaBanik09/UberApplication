import { Request, Response } from "express";
import User from "../../models/user/user.model";
import { UserRegisterRequest } from "../../types";

export class UserRepo{
    async register(req:UserRegisterRequest){
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
            const result = await addedUser.save()
            return result
    }
}