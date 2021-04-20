import mongoose from 'mongoose';
import User from './user.interface';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "No username",
        min: 6,
        max: 22
    },
    email: {
        type: String,
        required: "No email",
        min: 6,
        max: 40
    },
    password: {
        type: String,
        required: "No password",
        min: 8,
        max: 50
    },
    acceptedTerms: {
        type: Boolean,
        required: "No acceptedTerms",
    },
    hasRequiredAge: {
        type: Boolean,
        required: "No hasRequiredAge",
    },
    tokenVersion: {
        type: Number,
        required: "Missing tokenVersion",
    },
    active: {
        type: Boolean,
        required: "Has no status",
    },
    confirmationCode: {
        type: String,
        required: "Has no confirmation code",
    }
})

const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default UserModel;