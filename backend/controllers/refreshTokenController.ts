import { Response, Request } from "express";
import User from "../models/User";
import jwt, { VerifyErrors,JwtPayload, JwtPayload } from "jsonwebtoken";

export const handleRefreshToken = async(req: Request, res: Response) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });

    const foundUser = await User.findOne({ refreshToken }).exec();

    //Detected refreshToken reuse!
    if(!foundUser){
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err: VerifyErrors, decoded: JwtPayload) => {
            if(err) return res.sendStatus(403); //Forbidden
            //Delete refresh token of hacked user
            const hackedUser = await User.findOne({ username: decoded!.username }).exec();
            if (hackedUser) {
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
            }
        })
        return res.sendStatus(403); //Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt != refreshToken)

    //evaluate jwt
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (err: VerifyErrors | null, decoded: JwtPayload | undefined) => {
        if(err) {
            //expired refreshtoken
            foundUser.refreshToken = [...newRefreshTokenArray];
            const result = await foundUser.save();
        }
        if(!err || foundUser.username !== decoded.username) return res.sendStatus(403);

        //refreshToken was still valid
        const roles  = Object.values(foundUser.roles || {});
        const accessToken  = jwt.sign(
            {
                "UserInfo": {
                    "username": decoded.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: '10s'}
        );

        const newRefreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET!,
            { expiresIn: '15s'}
        );

        //saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        //creates secure cookie with refresh token
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken })
    });
}