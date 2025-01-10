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
exports.signupSchema = exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const middleware_1 = require("../middleware");
exports.userRouter = express_1.default.Router();
dotenv_1.default.config();
exports.signupSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(5).max(20),
    firstname: zod_1.z.string().max(20),
    lastname: zod_1.z.string().max(20)
});
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, firstname, lastname } = exports.signupSchema.parse(req.body);
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield db_1.userModel.create({
            username: username,
            password: hashedPassword,
            firstname: firstname,
            lastname: lastname
        });
        yield db_1.accountModel.create({
            userId: user._id,
            balance: Math.floor(Math.random() * 10000 + 1)
        });
        res.status(200).json({
            message: "User signed up successfully",
        });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({
                message: "Validation error",
            });
        }
        else if (error.code === 11000) {
            res.status(400).json({
                message: "User with same username already exists",
            });
        }
        else {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield db_1.userModel.findOne({ username });
        if (user) {
            const comparePassword = yield bcrypt_1.default.compare(password, user.password);
            if (comparePassword) {
                const jwtToken = jsonwebtoken_1.default.sign({
                    username: username
                }, process.env.JWT_SECRET || "", {
                    expiresIn: '1d'
                });
                res.status(200).json({
                    message: "User signed in successfully",
                    jwt: jwtToken
                });
            }
            else {
                res.status(400).json({
                    message: "Wrong Credentials"
                });
            }
        }
        else {
            res.status(400).json({
                message: "User not signed up"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "internal Server Error"
        });
    }
}));
const updateBody = zod_1.z.object({
    password: zod_1.z.string().optional(),
    firstname: zod_1.z.string().optional(),
    lastname: zod_1.z.string().optional(),
});
exports.userRouter.put("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = updateBody.safeParse(req.body);
        if (!success) {
            res.status(411).json({
                message: "Error while updating information"
            });
        }
        yield db_1.userModel.updateOne({ username: req.username }, req.body);
        res.json({
            message: "Updated successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "internal Server Error"
        });
    }
}));
exports.userRouter.get("/bulk", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.query.filter || "";
        const users = yield db_1.userModel.find({
            $or: [
                {
                    firstname: { "$regex": name }
                },
                {
                    lastname: { "$regex": name }
                }
            ]
        });
        res.json({
            user: users.map(user => ({
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname
            }))
        });
    }
    catch (error) {
        res.status(500).json({
            message: "internal Server Error"
        });
    }
}));
