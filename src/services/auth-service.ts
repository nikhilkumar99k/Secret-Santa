
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Users } from '../mongoDb/models/users';
import { LoginResponse, TokenPayload } from '../types/auth-response';
import { MongoService } from '../mongoDb/services/mongoService';

// Function to register a user
export const registerUser = async (name: string, username: string, password: string): Promise<void> => {
    try {
        // Check if user_id already exists
        const existingUser = await Users.findOne({ username });
        if (existingUser) {
            throw new Error('User ID already exists');
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user and save to the database
        const newUser = new Users({
            name,
            username,
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
export const authenticateUser = async (username: string, password: string): Promise<LoginResponse | null> => {
    // Find user by user_id
    const user = await MongoService.findOne(Users, { username });
    const SECRET_KEY = process.env.JWT_SECRET as string;

    if (!user) {
        throw new Error('User not found');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid password');
    }

    // Create token payload
    const tokenPayload: TokenPayload = {
        username: user.username,
        name: user.name,
        id: user._id.toString(), // Convert ObjectId to string
    };

    // Generate JWT token with expiration (3 hours)
    const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '3h' });

    return {
        token,
        user: {
            username: user.username,
            name: user.name,
        },
    };
};
