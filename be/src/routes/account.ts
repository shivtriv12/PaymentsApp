import express from "express";
import { authMiddleware } from "../middleware";
import { accountModel, userModel } from "../db";
import mongoose from "mongoose";

export const accountRouter = express.Router();

accountRouter.get("/balance",authMiddleware,async (req,res)=>{
    try {
        const user = await userModel.findOne({
            username:req.username
        });
        if(user){
            const account = await accountModel.findOne({
                userId:user._id
            });
            res.status(200).json({
                balance:account?.balance
            });
        }
        
    } catch (error) {
        res.status(500).json({
            message:"internal Server Error"
        });
    }
});

accountRouter.post("/transfer",authMiddleware,async(req,res)=>{
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        const {to,amount} = req.body;
        const senderUser = await userModel.findOne({
            username:req.username
        }).session(session);
        const senderAccount = await accountModel.findOne({
            userId:senderUser?._id
        }).session(session);
        if (!senderAccount || senderAccount.balance < amount) {
            await session.abortTransaction();
            res.status(400).json({
                message: "Insufficient balance"
            });
        }
        const recevierAccount = await accountModel.findOne({
            userId:to
        }).session(session);
        if (!recevierAccount) {
            await session.abortTransaction();
            res.status(400).json({
                message: "Invalid account"
            });
        }

        await accountModel.updateOne({ userId: senderUser?._id }, { $inc: { balance: -amount } }).session(session);
        await accountModel.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });

    } catch (error) {
        res.status(500).json({
            message:"internal Server Error"
        });
        console.log(error);
    }
})