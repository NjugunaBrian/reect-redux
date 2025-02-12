import { Response, Request } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";

export const handleNewUser = async (req: Request, res: Response) => {

    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message': "Username and password are required." });

    //check for duplicate names in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409);

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${user} created!`})

    } catch (error: any){
        res.status(500).json({ 'message': error.message })
    }

}