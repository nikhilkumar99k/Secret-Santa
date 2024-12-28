import { Request, Response } from 'express';
import { fetchWeatherData } from '../services/api-service';

export const getWeatherData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Use coordinates from query parameters
    const { lat, lon } = req.query;

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
