import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import Event from '../../schemas/Event';
import { connectDB } from '../../dbConnection';
import { authenticateUser, jsonResponse } from '../../utils';


export const createEvent = async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        await connectDB();

        
        const authHeader = event.headers?.authorization || event.headers?.Authorization;
        console.log("Auth header:", authHeader);
        
        if (!authHeader) {
            return jsonResponse(401, { error: 'Authentication failed', message: 'No authorization header provided' });
        }

        const token = authHeader.split(' ')[1];
        console.log("Token extracted:", token ? "Token found" : "Token missing");
        
        if (!token) {
            return jsonResponse(401, { error: 'Authentication failed', message: 'No token in authorization header' });
        }
        const user = await authenticateUser(token);
        if (!user) {
            return jsonResponse(401, { error: 'Authentication failed', message: 'Invalid token' });
        }
            
        const body = event.body ? JSON.parse(event.body) : {}
        const { title, description, date, registrationDateStart, registrationDateEnd, capacity, imageKey } = body
        if (!title || !description || !date || !registrationDateStart || !registrationDateEnd || !capacity || !imageKey) {
            return jsonResponse(400, { error: 'Missing required fields', message: 'All fields are required: title, description, date, registrationDateStart, registrationDateEnd, capacity, imageKey' });
        }
        const eventId = uuidv4();
        const newEvent = new Event({
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
        return jsonResponse(201, {
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
    } catch (error) {
        console.error('Event creation error:', error);
        return jsonResponse(500, { error: 'Event creation failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};