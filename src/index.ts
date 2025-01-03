import dotenv from 'dotenv';
import app from './app';
import { connectToMongo } from './mongoDb';

// Load environment variables
dotenv.config();

const startServer = async () => {
  try {
    await connectToMongo();
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
