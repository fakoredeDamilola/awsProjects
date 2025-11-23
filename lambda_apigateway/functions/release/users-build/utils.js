"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonResponse = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("./schemas/User"));
const authenticateUser = async (token) => {
    try {
        if (!token) {
            console.error('Authentication error: No token provided');
            return null;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.jwtSecret || 'your-secret-key');
        console.log({ decoded });
        const user = await User_1.default.findById(decoded.userId);
        return user;
    }
    catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
};
exports.authenticateUser = authenticateUser;
const jsonResponse = (statusCode, body) => {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // adjust for production
            "Access-Control-Allow-Credentials": "true",
        },
        body: JSON.stringify(body),
    };
};
exports.jsonResponse = jsonResponse;
//# sourceMappingURL=utils.js.map