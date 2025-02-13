import { Response, Request, NextFunction } from "express";
import User from "../models/User";

export const handleLogOut = async(req: Request, res: Response, next: NextFunction) => {
    //on client, also delete the accesstoken

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    //Is refreshtoken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser){
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.sendStatus(204);
    }

    //Delete refreshtoken in db
    if (foundUser) {
        foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt != refreshToken);
        const result = await foundUser.save();
        console.log(result);
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
    }
    return res.sendStatus(204);
    
}