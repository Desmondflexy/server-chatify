import { Document, model, Schema } from "mongoose";
export interface IUser extends Document {
    email: string;
    password?: string;
    displayName: string;
    picture: string;
    phone: string;
    ssoId: string;
    ssoProvider: string;
    cPin: string;
}

const userSchema = new Schema<IUser>({
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
    },
    cPin: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

export default model<IUser>('User', userSchema);

