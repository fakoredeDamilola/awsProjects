import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { connectDB } from '../../dbConnection';
import { authenticateUser, jsonResponse } from '../../utils';
import Event from '../../schemas/Event';

export const seeAllEvents = async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        await connectDB();
        const events = await Event.find();
        return jsonResponse(200, {
            message: 'Events retrieved successfully',
            events,
        });
    } catch (error) {
        console.error('Event retrieval error:', error);
        return jsonResponse(500, { error: 'Event retrieval failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};