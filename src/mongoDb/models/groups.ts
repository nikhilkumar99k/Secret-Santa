import mongoose, { Schema, Document } from 'mongoose';

interface Group extends Document {
  group_name: string;
  admin: mongoose.Types.ObjectId; // Reference to the admin (User)
  members: mongoose.Types.ObjectId[]; // References to members (Users)
  max_members: number;
  is_matches: boolean;
  matches_visible: boolean;
}

const groupSchema = new Schema<Group>({
  group_name: {
    type: String,
    required: true,
    unique: true, // Ensure unique group names
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
  max_members: {
    type: Number,
    required: true,
    default: 100,
  },
  is_matches: {
    type: Boolean,
    required: true,
    default: false,
  },
  matches_visible: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Validate members count against `max_members`
groupSchema.pre('save', function (next) {
  if (this.members.length > this.max_members) {
    return next(new Error(`Members exceed the maximum limit of ${this.max_members}`));
  }
  next();
});

const Groups = mongoose.model<Group>('Groups', groupSchema);

export { Groups, Group };
