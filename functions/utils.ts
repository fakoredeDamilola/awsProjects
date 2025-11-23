import jwt from 'jsonwebtoken';
import User from './schemas/User';
import { APIGatewayProxyResult } from 'aws-lambda';

export const authenticateUser = async (token: string | undefined) => {
    try {
        if (!token) {
            console.error('Authentication error: No token provided');
            return null;
        }
        
        const decoded = jwt.verify(token, process.env.jwtSecret || 'your-secret-key') as any;
        console.log({decoded})

        const user = await User.findById(decoded.userId);
        return user;
    } catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
};

export const jsonResponse = (statusCode: number, body: object): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",   // adjust for production
      "Access-Control-Allow-Credentials": "true",
    },
    body: JSON.stringify(body),
  };
};