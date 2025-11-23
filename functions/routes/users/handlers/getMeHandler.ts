import { APIGatewayProxyEvent } from 'aws-lambda';
import { connectDB } from '../../../dbConnection';
import { authenticateUser, jsonResponse } from '../../../utils';

export const getMe = async (event: APIGatewayProxyEvent) => {
    try {
        console.log("Event headers:", JSON.stringify(event.headers));
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
        return jsonResponse(200, {
            message: 'User retrieved successfully',
            user,
        });
    }
    catch (error) {
        console.error('User retrieval error:', error);
        return jsonResponse(500, { error: 'User retrieval failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};
