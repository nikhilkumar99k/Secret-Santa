import { Locations } from "../models/locations";
import { MongoService } from "../services/mongoService";


export const saveLocationData = async (data: {
    timestamp: Date;
    lat: number;
    long: number;
    temp_c: number;
    region: string;
  }): Promise<void> => {
    try {
        await MongoService.create(new Locations(data));
    } catch (error) {
      console.error('Error saving location data to DB:', error);
      throw new Error('Failed to save location data');
    }
  };