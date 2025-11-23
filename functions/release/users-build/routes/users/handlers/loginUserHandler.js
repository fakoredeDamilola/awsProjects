"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../../../schemas/User"));
const dbConnection_1 = require("../../../dbConnection");
const utils_1 = require("../../../utils");
const loginUser = async (body) => {
    try {
        await (0, dbConnection_1.connectDB)();
        const { email, password } = body;
        if (!email || !password) {
            return (0, utils_1.jsonResponse)(400, { error: 'Missing required fields', message: 'Email and password are required' });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return (0, utils_1.jsonResponse)(401, { error: 'Authentication failed', message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return (0, utils_1.jsonResponse)(401, { error: 'Authentication failed', message: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.userId, email: user.email }, process.env.jwtSecret || 'your-secret-key', { expiresIn: '7d' });
        return (0, utils_1.jsonResponse)(200, {
            message: 'Login successful',
            user: {
                userId: user.userId,
                email: user.email,
                name: user.name,
            },
            token,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return (0, utils_1.jsonResponse)(500, { error: 'Login failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};
exports.loginUser = loginUser;
//# sourceMappingURL=loginUserHandler.js.map