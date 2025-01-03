import mongoose, { Schema, Document } from 'mongoose';

// Interface for SeacterMatches
interface SecterMatches extends Document {
  group_id: mongoose.Types.ObjectId; // Reference to the Groups model
  matches: Map<mongoose.Types.ObjectId, mongoose.Types.ObjectId>; // Key-value pairs of matches
}

// Define the schema
const secterMatchesSchema = new Schema<SecterMatches>({
  group_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Groups', // Reference the Groups model
    required: true,
  },
  matches: {
    type: Map, // Using Map to represent a Record<string, string>
    of: mongoose.Schema.Types.ObjectId, // The value type for the Map is ObjectId
    required: true,
  },
});

// Create the model
const SecterMatches = mongoose.model<SecterMatches>('SeacterMatches', secterMatchesSchema);

export { SecterMatches, SecterMatches as SecterMatch }; // Alias export for backward compatibility
