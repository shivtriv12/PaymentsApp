import express from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function authMiddleware(req:express.Request,res:express.Response,next:express.NextFunction):void{
    const authHeader = req.headers.authorization as string;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(400).json({message:"User not logged in"});
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET||"") as JwtPayload;
        req.username = decoded.username;
        next();
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
}