import { Response, Request, NextFunction } from "express";
import User from "../models/User";
import jwt, { VerifyErrors } from "jsonwebtoken";

interface CustomJwtPayload extends jwt.JwtPayload {
  username: string;
}

export const handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  const foundUser = await User.findOne({ refreshToken }).exec();

  //Detected refreshToken reuse!
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
      async (err: VerifyErrors | null, decoded: any) => {
        if (err) return res.sendStatus(403); //Forbidden
        //Delete refresh token of hacked user
        const hackedUser = await User.findOne({
          username: decoded.username,
        }).exec();
        if (hackedUser) {
          hackedUser.refreshToken = [];
          const result = await hackedUser.save();
        }
      }
    );
    return res.sendStatus(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt != refreshToken
  );

  //evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!,
    async (
      err: VerifyErrors | null,
      decoded: jwt.JwtPayload | string | undefined
    ) => {
      if (err) {
        //expired refreshtoken
        foundUser.refreshToken = [...newRefreshTokenArray];
        const result = await foundUser.save();
        return res.sendStatus(403);
      }
      if (typeof decoded === "object" && decoded && "username" in decoded) {
        const decodedPayload: CustomJwtPayload = decoded as CustomJwtPayload;

        if (foundUser.username !== decodedPayload.username)
          return res.sendStatus(403);

        //refreshToken was still valid
        const roles = Object.values(foundUser.roles || {});
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: decodedPayload.username,
              roles: roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET!,
          { expiresIn: "10s" }
        );

        const newRefreshToken = jwt.sign(
          { username: foundUser.username },
          process.env.REFRESH_TOKEN_SECRET!,
          { expiresIn: "15s" }
        );

        //saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        //creates secure cookie with refresh token
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken });
      } else {
        res.sendStatus(403); //Forbidden
      }
    }
  );
};
