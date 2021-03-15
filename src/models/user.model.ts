import mongoose from 'mongoose';
import User from './user.interface';

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: "No id",
    },
    username: {
        type: String,
        required: "No username",
        min: 2,
        max: 20
    },
    email: {
        type: String,
        required: "No email",
        min: 5,
        max: 50
    },
    password: {
        type: String,
        required: "No password",
        min: 8,
        max: 50
    }
})

const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default UserModel;