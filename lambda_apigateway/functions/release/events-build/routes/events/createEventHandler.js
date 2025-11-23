"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = void 0;
const uuid_1 = require("uuid");
const Event_1 = __importDefault(require("../../schemas/Event"));
const dbConnection_1 = require("../../dbConnection");
const utils_1 = require("../../utils");
const createEvent = async (event) => {
    try {
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
        const body = event.body ? JSON.parse(event.body) : {};
        const { title, description, date, registrationDateStart, registrationDateEnd, capacity, imageKey } = body;
        if (!title || !description || !date || !registrationDateStart || !registrationDateEnd || !capacity || !imageKey) {
            return (0, utils_1.jsonResponse)(400, { error: 'Missing required fields', message: 'All fields are required: title, description, date, registrationDateStart, registrationDateEnd, capacity, imageKey' });
        }
        const eventId = (0, uuid_1.v4)();
        const newEvent = new Event_1.default({
            eventId,
            organizerId: user.userId,
            title,
            description,
            date,
            registrationDateStart,
            registrationDateEnd,
            capacity,
            imageKey,
        });
        await newEvent.save();
        return (0, utils_1.jsonResponse)(201, {
            message: 'Event created successfully',
            event: {
                eventId: newEvent.eventId,
                organizerId: newEvent.organizerId,
                title: newEvent.title,
                description: newEvent.description,
                date: newEvent.date,
                registrationDateStart: newEvent.registrationDateStart,
                registrationDateEnd: newEvent.registrationDateEnd,
                capacity: newEvent.capacity,
                imageKey: newEvent.imageKey,
                createdAt: newEvent.createdAt,
            },
        });
    }
    catch (error) {
        console.error('Event creation error:', error);
        return (0, utils_1.jsonResponse)(500, { error: 'Event creation failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};
exports.createEvent = createEvent;
//# sourceMappingURL=createEventHandler.js.map