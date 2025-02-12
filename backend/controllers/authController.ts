import { Response, Request } from "express";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const handleLogin = async (req: Request, res: Response) => {

    const cookies = req.cookies;

    const { user, pwd } = req.body;
    if(!user || !pwd) return res.status(400).json({ 'message': "Username and password are required." });

    const foundUser = await User.findOne({ username: user }).exec();
    if(!foundUser) return res.status(401); //Unauthorized

    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match){
        const roles = Object.values(foundUser.roles || {}).filter(Boolean);
        //create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '10s' }
        );

        const newRefreshToken = jwt.sign(
            { "username" : foundUser.username },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '15s' }
        );

        let newRefreshTokenArray = !cookies?.jwt ? foundUser.refreshToken : foundUser.refreshToken.filter(rt => rt != cookies.jwt)
        
        if(cookies?.jwt){
            /* 
            Scenario added here: 
                1) User logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
            */
           const refreshToken = cookies.jwt;
           const foundToken = await User.findOne({ refreshToken }).exec();

           //Detected refreshToken reuse!
           if(!foundToken){
            //clear out all previous tokens
            newRefreshTokenArray  = [];
           }
           res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true
           })
        }

        //saving refreshToken with currentUser
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        //Creates secure cookie with refresh token
        res.cookie('jwt', newRefreshToken, { 
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 
        });

        //send authorization roles and access token to user
        res.json({ accessToken });

    } else {
        res.sendStatus(401);
    }

}