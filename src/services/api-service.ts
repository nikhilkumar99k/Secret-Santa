import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const fetchWeatherData = async (latitude: string, longitude: string): Promise<any> => {
  try {
    const API_KEY = process.env.API_KEY as string;
    const BASE_URL = process.env.BASE_URL as string;
    
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: `${latitude},${longitude}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Unable to fetch weather data');
  }
};
