
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Users } from '../mongoDb/models/users';
import { LoginResponse } from '../types/auth-response';
import { MongoService } from '../mongoDb/services/mongoService';

// Function to register a user
export const registerUser = async (name: string, user_id: string, password: string): Promise<void> => {
    try {
        // Check if user_id already exists
        const existingUser = await Users.findOne({ user_id });
        if (existingUser) {
            throw new Error('User ID already exists');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user and save to the database
        const newUser = new Users({
            name,
            user_id,
            password: hashedPassword,
        });

        await MongoService.create(newUser);
    } catch (error: unknown) {
        console.error('Error registering user:', error);
        throw new Error(
            error instanceof Error
                ? error.message
                : 'Failed to register the user'
        );
    }
};

// Function to authenticate a user
export const authenticateUser = async (user_id: string, password: string): Promise<LoginResponse | null> => {
    // Find user by user_id
    const user = await Users.findOne({ user_id });
    const SECRET_KEY = process.env.JWT_SECRET as string;

    if (!user) {
        throw new Error('User not found');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign(
        {
            user_id: user.user_id,
            name: user.name,
        },
        SECRET_KEY, // Use an environment variable for secret
        { expiresIn: '3h' } // Token expiration time (3 hour)
    );

    return {
        token,
        user: {
            user_id: user_id,
            name: user.name,
        },
    };
};
