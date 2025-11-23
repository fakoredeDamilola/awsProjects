"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = void 0;
const dbConnection_1 = require("../../../dbConnection");
const utils_1 = require("../../../utils");
const getMe = async (event) => {
    try {
        console.log("Event headers:", JSON.stringify(event.headers));
        await (0, dbConnection_1.connectDB)();
        const authHeader = event.headers?.authorization || event.headers?.Authorization;
        console.log("Auth header:", authHeader);
        if (!authHeader) {
            return (0, utils_1.jsonResponse)(401, { error: 'Authentication failed', message: 'No authorization header provided' });
        }
        const token = authHeader.split(' ')[1];
        console.log("Token extracted:", token ? "Token found" : "Token missing");
        if (!token) {
            return (0, utils_1.jsonResponse)(401, { error: 'Authentication failed', message: 'No token in authorization header' });
        }
        const user = await (0, utils_1.authenticateUser)(token);
        if (!user) {
            return (0, utils_1.jsonResponse)(401, { error: 'Authentication failed', message: 'Invalid token' });
        }
        return (0, utils_1.jsonResponse)(200, {
            message: 'User retrieved successfully',
            user,
        });
    }
    catch (error) {
        console.error('User retrieval error:', error);
        return (0, utils_1.jsonResponse)(500, { error: 'User retrieval failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=getMeHandler.js.map