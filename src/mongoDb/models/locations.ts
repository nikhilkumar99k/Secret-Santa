import mongoose, { Schema, Document } from 'mongoose';

interface LocationData extends Document {
    timestamp: Date;
    lat: number;
    long: number;
    temp_c: number;
    region: string;
}

const locationSchema = new Schema<LocationData>({
    timestamp: {
        type: Date,
        default: Date.now,
    },
    lat: {
        type: Number,
        required: true,
    },
    long: {
        type: Number,
        required: true,
    },
    temp_c: {
        type: Number,
        required: true,
    },
    region: {
        type: String,
        required: true,
    }
});

const Locations = mongoose.model<LocationData>('Locations', locationSchema);

export { Locations, LocationData };
