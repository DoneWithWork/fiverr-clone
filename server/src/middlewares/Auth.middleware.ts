import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";

// Extend JwtPayload to include custom properties

// Extend the Request interface to include userId and isSeller
interface IUserRequest extends Request {
  userId?: string;
  isSeller?: boolean;
}

export const verifyToken = (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["accessToken"];

  if (!token) {
    throw new Error("Token is not provided!");
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (
      err: JsonWebTokenError | null,
      decoded: JwtPayload | string | undefined
    ) => {
      if (err) {
        throw new Error("Token is not provided!");
      }

      if (typeof decoded === "object" && decoded !== null) {
        const payload = decoded;
        req.userId = payload.id;
        console.log(payload);
        req.isSeller = payload.isSeller;
      } else {
        return next(new Error("Token payload is not valid!"));
      }

      next();
    }
  );
};
