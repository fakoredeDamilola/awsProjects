"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seeAllEvents = void 0;
const dbConnection_1 = require("../../dbConnection");
const utils_1 = require("../../utils");
const Event_1 = __importDefault(require("../../schemas/Event"));
const seeAllEvents = async (event) => {
    try {
        await (0, dbConnection_1.connectDB)();
        const events = await Event_1.default.find();
        return (0, utils_1.jsonResponse)(200, {
            message: 'Events retrieved successfully',
            events,
        });
    }
    catch (error) {
        console.error('Event retrieval error:', error);
        return (0, utils_1.jsonResponse)(500, { error: 'Event retrieval failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};
exports.seeAllEvents = seeAllEvents;
//# sourceMappingURL=seeAllEventsHandler.js.map