import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../../schemas/User';
import { connectDB } from '../../../dbConnection';
import { jsonResponse } from '../../../utils';


export const loginUser = async (body:any) => {
    try {
        await connectDB();

        const {email, password} = body

        if (!email || !password) {
            return jsonResponse(400, { error: 'Missing required fields', message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return jsonResponse(401, { error: 'Authentication failed', message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return jsonResponse(401, { error: 'Authentication failed', message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user.userId, email: user.email },
            process.env.jwtSecret || 'your-secret-key',
            { expiresIn: '7d' }
        );

        return jsonResponse(200, {
            message: 'Login successful',
            user: {
                userId: user.userId,
                email: user.email,
                name: user.name,
            },
            token,
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return jsonResponse(500, { error: 'Login failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};
