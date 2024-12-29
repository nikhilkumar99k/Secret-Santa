import mongoose, { Schema, Document } from 'mongoose';

interface Group extends Document {
    id: number;
    group_name: string;
    admin: mongoose.Types.ObjectId;  // Reference to the admin (User)
    members: mongoose.Types.ObjectId[];  // References to members (Users)
}

const groupSchema = new Schema<Group>({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    group_name: {
        type: String,
        required: true,
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
        }
    ],
});

const Groups = mongoose.model<Group>('Groups', groupSchema);

export { Groups, Group };
