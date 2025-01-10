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
        const hashedPassword = bcrypt_1.default.hash(password, 10);
        yield db_1.userModel.create({
            username: username,
            password: hashedPassword,
            firstname: firstname,
            lastname: lastname
        });
        const jwtToken = jsonwebtoken_1.default.sign({
            username: username
        }, process.env.JWT_SECRET || "", {
            expiresIn: '1d'
        });
        res.status(200).json({
            message: "User signed up successfully",
            jwt: jwtToken
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
                message: "User already exists",
            });
        }
        else {
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }
}));
exports.userRouter.post("/sigin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                message: "User not signed in"
            });
        }
    }
    catch (error) {
        res.status(500).json({
            message: "internal Server Error"
        });
    }
}));
