"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerUsers = void 0;
const registerUserHandler_1 = require("./routes/users/handlers/registerUserHandler");
const loginUserHandler_1 = require("./routes/users/handlers/loginUserHandler");
const dbConnection_1 = require("./dbConnection");
const getMeHandler_1 = require("./routes/users/handlers/getMeHandler");
const handlerUsers = async (event) => {
    await (0, dbConnection_1.connectDB)();
    const path = event.path || "";
    const method = event.httpMethod || "GET";
    const body = event.body ? JSON.parse(event.body) : {};
    // Normalize path under /users
    // e.g., API Gatewpay invokes /users/register or /users/login
    console.log({ path, method, body });
    if (path.match(/\/users\/register$/) && method === "POST") {
        const res = await (0, registerUserHandler_1.registerUser)(body);
        return { statusCode: res.statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(res.body) };
    }
    if (path.match(/\/users\/login$/) && method === "POST") {
        const res = await (0, loginUserHandler_1.loginUser)(body);
        return { statusCode: res.statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(res.body) };
    }
    if (path.match(/\/users\/me$/) && method === "GET") {
        const res = await (0, getMeHandler_1.getMe)(event);
        return { statusCode: res.statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(res.body) };
    }
    return { statusCode: 404, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Not found" }) };
};
exports.handlerUsers = handlerUsers;
//# sourceMappingURL=handle-users.js.map