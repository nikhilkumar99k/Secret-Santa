import express, { Application } from 'express';
import apiRoutes from './routers/api-route';
import { connectToMongo } from './mongoDb';

const app: Application = express();

// Middleware to parse JSON
app.use(express.json());

// Route handling
app.use('/api', apiRoutes);

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectToMongo();
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
