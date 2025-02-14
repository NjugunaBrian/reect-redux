import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        export interface Request {
            user?: string;
            roles?: string[];
        }
    }
}


const verifyJWT = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = (req.headers.authorization || req.headers.Authorization) as string;
    if(!authHeader?.startsWith('Bearer ')) {
        res.status(401).send("Unauthorized: No token provided");
        return;
    }    
    const token = authHeader.split(' ')[1];
    console.log(token);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: any, decoded: any) => {
        if(err){
            res.sendStatus(403); //invalid token
            return;
        } 
        req.user = decoded.UserInfo.username;
        req.roles = decoded.UserInfo.roles;
        next();
    });

}

export default verifyJWT