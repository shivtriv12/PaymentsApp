"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountRouter = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const db_1 = require("../db");
const mongoose_1 = __importDefault(require("mongoose"));
exports.accountRouter = express_1.default.Router();
exports.accountRouter.get("/balance", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.userModel.findOne({
            username: req.username
        });
        if (user) {
            const account = yield db_1.accountModel.findOne({
                userId: user._id
            });
            res.status(200).json({
                balance: account === null || account === void 0 ? void 0 : account.balance
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "internal Server Error"
        });
    }
}));
exports.accountRouter.post("/transfer", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        const { to, amount } = req.body;
        const senderUser = yield db_1.userModel.findOne({
            username: req.username
        }).session(session);
        const senderAccount = yield db_1.accountModel.findOne({
            userId: senderUser === null || senderUser === void 0 ? void 0 : senderUser._id
        }).session(session);
        if (!senderAccount || senderAccount.balance < amount) {
            yield session.abortTransaction();
            res.status(400).json({
                message: "Insufficient balance"
            });
        }
        const recevierAccount = yield db_1.accountModel.findOne({
            userId: to
        }).session(session);
        if (!recevierAccount) {
            yield session.abortTransaction();
            res.status(400).json({
                message: "Invalid account"
            });
        }
        yield db_1.accountModel.updateOne({ userId: senderUser === null || senderUser === void 0 ? void 0 : senderUser._id }, { $inc: { balance: -amount } }).session(session);
        yield db_1.accountModel.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
        yield session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "internal Server Error"
        });
        console.log(error);
    }
}));
