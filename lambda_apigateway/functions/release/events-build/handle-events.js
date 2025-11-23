"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerEvents = void 0;
const createEventHandler_1 = require("./routes/events/createEventHandler");
const seeAllEventsHandler_1 = require("./routes/events/seeAllEventsHandler");
const dbConnection_1 = require("./dbConnection");
const handlerEvents = async (event) => {
    await (0, dbConnection_1.connectDB)();
    const path = event.path || "";
    const method = event.httpMethod || "GET";
    const body = event.body ? JSON.parse(event.body) : {};
    const token = event.headers.authorization?.split(' ')[1];
    // Normalize path under /users
    // e.g., API Gatewpay invokes /users/register or /users/login
    console.log({ path, method, body, token });
    if (path.match(/\/events\/create$/) && method === "POST") {
        const res = await (0, createEventHandler_1.createEvent)(body);
        return { statusCode: res.statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(res.body) };
    }
    if (path.match(/\/events\/allll$/) && method === "GET") {
        const res = await (0, seeAllEventsHandler_1.seeAllEvents)(body);
        return { statusCode: res.statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(res.body) };
    }
    return { statusCode: 404, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: "Not found" }) };
};
exports.handlerEvents = handlerEvents;
//# sourceMappingURL=handle-events.js.map