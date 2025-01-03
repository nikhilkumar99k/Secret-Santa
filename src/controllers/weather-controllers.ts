import { Request, Response } from 'express';
import { fetchWeatherData } from '../services/weather-services';
import { CustomRequestWithUser } from '../types/request-type';

export const getWeatherData = async (req: CustomRequestWithUser, res: Response): Promise<void> => {
  try {
    const user = req.user;
    // Use coordinates from query parameters
    const { lat, lon } = req.body;

    if (!lat || !lon) {
      res.status(400).json({ error: 'Latitude and Longitude are required' });
      return;
    }

    // Call the service to get weather data
    const weatherData = await fetchWeatherData(lat as string, lon as string);

    res.status(200).json(weatherData);
  } catch (error:any) {
    res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
  }
};
