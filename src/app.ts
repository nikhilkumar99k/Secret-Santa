import express, { Application } from 'express';
import apiRoutes from './routers/api-route';

const app: Application = express();

// Middleware to parse JSON
app.use(express.json());

// Route handling
app.use('/api', apiRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
