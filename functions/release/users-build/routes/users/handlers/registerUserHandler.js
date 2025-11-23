"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../../schemas/User"));
const dbConnection_1 = require("../../../dbConnection");
const utils_1 = require("../../../utils");
const registerUser = async (body) => {
    try {
        await (0, dbConnection_1.connectDB)();
        console.log({ body });
        const { email, password, name } = body;
        if (!email || !password || !name) {
            return (0, utils_1.jsonResponse)(400, { error: 'Missing required fields', message: 'Email, password, and name are required' });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return (0, utils_1.jsonResponse)(409, { error: 'User already exists', message: 'A user with this email already exists' });
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
        const userId = (0, uuid_1.v4)();
        const newUser = new User_1.default({
            userId,
            email,
            passwordHash,
            name,
        });
        await newUser.save();
        const token = jsonwebtoken_1.default.sign({ userId: newUser.userId, email: newUser.email }, process.env.jwtSecret || 'your-secret-key', { expiresIn: '7d' });
        return (0, utils_1.jsonResponse)(201, {
            message: 'User registered successfully',
            user: {
                userId: newUser.userId,
                email: newUser.email,
                name: newUser.name,
            },
            token,
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return (0, utils_1.jsonResponse)(500, { error: 'Registration failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};
exports.registerUser = registerUser;
//# sourceMappingURL=registerUserHandler.js.map