import axios from 'axios';
import dotenv from 'dotenv';
import { saveLocationData } from '../mongoDb/repositoty/locatonsRepo';

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
    if (!response.data) {
      throw new Error('No data received from weather API');
    }

    const { location, current } = response.data;

    const locationData = {
      timestamp: new Date(location.localtime),
      lat: location.lat ?? Number(latitude),
      long: location.lon ?? Number(longitude),
      temp_c: current.temp_c,
      region: `${location.name}, ${location.region}`,
    };
    await saveLocationData(locationData);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Unable to fetch weather data');
  }
};
