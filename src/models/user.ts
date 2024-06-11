import mongoose from "mongoose";
import { IUser } from "../types";

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
    },
    displayName: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
    },
    ssoId: {
        type: String,
    },
    ssoProvider: {
        type: String,
    }
}, {
    timestamps: true,
});

export default mongoose.model<IUser>('User', userSchema);

