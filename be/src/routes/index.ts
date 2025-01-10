import express from "express";
import { userRouter } from "./user";

export const mainRouter = express.Router();

mainRouter.use("/user",userRouter);