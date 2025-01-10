import express from "express";
import bcrypt from "bcrypt";
import { z, ZodError } from "zod";
import { userModel } from "../db";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authMiddleware } from "../middleware";

export const userRouter = express.Router();
dotenv.config();

export const signupSchema = z.object({
    username:z.string().email(),
    password:z.string().min(5).max(20),
    firstname:z.string().max(20),
    lastname:z.string().max(20)
});

userRouter.post("/signup",async (req,res)=>{
    try {
        const {username,password,firstname,lastname} = signupSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password,10);
        
        await userModel.create({
            username:username,
            password:hashedPassword,
            firstname:firstname,
            lastname:lastname
        });

        const jwtToken:string = jwt.sign({
            username:username
        },process.env.JWT_SECRET||"",{
            expiresIn:'1d'
        });

        res.status(200).json({
            message:"User signed up successfully",
            jwt:jwtToken
        });

    } catch (error) {
        if(error instanceof ZodError){
            res.status(400).json({
                message:"Validation error",
            });
        }
        else if((error as any).code===11000){
            res.status(400).json({
                message:"User with same username already exists",
            });
        }
        else{
            console.log(error);
            res.status(500).json({
                message:"Internal server error",
            });
        }
    }
});

userRouter.post("/signin",async (req,res)=>{
    try {
        const {username,password} = req.body;
        const user = await userModel.findOne({username});
        if(user){
            const comparePassword = await bcrypt.compare(password,user.password);
            if(comparePassword){
                const jwtToken:string = jwt.sign({
                    username:username
                },process.env.JWT_SECRET||"",{
                    expiresIn:'1d'
                });

                res.status(200).json({
                    message:"User signed in successfully",
                    jwt:jwtToken
                });
            }
            else{
                res.status(400).json({
                    message:"Wrong Credentials"
                });
            }
        }
        else{
            res.status(400).json({
                message:"User not signed up"
            });
        }
    } catch (error) {
        res.status(500).json({
            message:"internal Server Error"
        });
    }
});

userRouter.put("/",authMiddleware,async (req,res)=>{
    const {firstname,lastname,password} = req.body();
    
});