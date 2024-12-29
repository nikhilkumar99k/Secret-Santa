import { Router } from 'express';
import { getWeatherData } from '../controllers/api-controller';

const apiRoutes: Router = Router();

// Route to fetch weather data
apiRoutes.post('/weather', getWeatherData);

export default apiRoutes;
