
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import User from '../../../schemas/User';
import { connectDB } from '../../../dbConnection';
import { jsonResponse } from '../../../utils';

export const registerUser = async (body:any) => {
    try {

        await connectDB();

        console.log({body}) 

        const {email, password, name} = body

        if (!email || !password || !name) {
            return jsonResponse(400, { error: 'Missing required fields', message: 'Email, password, and name are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return jsonResponse(409, { error: 'User already exists', message: 'A user with this email already exists' });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const userId = uuidv4();
        const newUser = new User({
            userId,
            email,
            passwordHash,
            name,
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser.userId, email: newUser.email },
            process.env.jwtSecret || 'your-secret-key',
            { expiresIn: '7d' }
        );

        return jsonResponse(201, {
            message: 'User registered successfully',
            user: {
                userId: newUser.userId,
                email: newUser.email,
                name: newUser.name,
            },
            token,
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return jsonResponse(500, { error: 'Registration failed', message: error instanceof Error ? error.message : 'Unknown error' });
    }
};
        