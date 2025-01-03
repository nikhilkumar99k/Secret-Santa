import { Request, Response } from 'express';
import { authenticateUser, registerUser } from '../services/auth-service';

export const signupController = async (req: Request, res: Response): Promise<void> => {
    const { name, username, password } = req.body;

    try {
        // Validate input
        if (!name || !username || !password) {
            res.status(400).json({ message: 'All fields are required: name, username, password' });
            return;
        }

        // Register user
        await registerUser(name, username, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        res.status(400).json({ message });
    }
};


export const loginController = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            res.status(400).json({ message: 'All fields are required: username, password' });
            return;
        }
        const loginResponse = await authenticateUser(username, password);

        // Respond with JWT token and user details
        res.status(200).json({
            message: 'Login successful',
            token: loginResponse?.token,
            user: loginResponse?.user,
        });
    } catch (error:any) {
        res.status(400).json({ message: error.message });
    }
}