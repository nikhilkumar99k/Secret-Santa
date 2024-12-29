import mongoose, { Schema, Document } from 'mongoose';

interface User extends Document {
    user_id: string;
    name: string;
    password: string;
}

const userSchema = new Schema<User>({
    name: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const Users = mongoose.model<User>('Users', userSchema);

export { Users, User };
