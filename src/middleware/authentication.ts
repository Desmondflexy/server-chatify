import { NextFunction, Request, Response } from "express";
import { devLog } from "../utils/helpers";
import { verifyToken } from "../utils/jwt";

export interface IPayload {
    id: string;
    displayName: string;
    email: string;
    iat: number;
    exp: number;
}

export default function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    if (!token) return res.status(401).json("Please login");
    try {
        const decodedPayload = verifyToken(token);
        req.user = decodedPayload as IPayload;
        next();
    } catch (error: any) {
        devLog(error.message);
        return res.status(401).json("Please login");
    }
}

declare module "express-serve-static-core" {
    interface Request {
        user: IPayload;
    }
}
