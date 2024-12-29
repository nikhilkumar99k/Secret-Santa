import { Request, Response } from 'express';
import { authenticateUser, registerUser } from '../services/auth-service';

export const signupController = async (req: Request, res: Response): Promise<void> => {
    const { name, user_id, password } = req.body;

    try {
        // Validate input
        if (!name || !user_id || !password) {
            res.status(400).json({ message: 'All fields are required: name, user_id, password' });
            return;
        }

        // Register user
        await registerUser(name, user_id, password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error: any) {
        const message = error instanceof Error ? error.message : 'Something went wrong';
        res.status(400).json({ message });
    }
};


export const loginController = async (req: Request, res: Response): Promise<void> => {
    const { user_id, password } = req.body;
    try {
        if (!user_id || !password) {
            res.status(400).json({ message: 'All fields are required: user_id, password' });
            return;
        }
        const loginResponse = await authenticateUser(user_id, password);

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