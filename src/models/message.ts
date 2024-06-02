import mongoose from "mongoose";
import { IMessage } from "../types";

const messageSchema = new mongoose.Schema<IMessage>({
    text: {
        type: String,
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
}, {
    timestamps: true,
});

export default mongoose.model<IMessage>('Message', messageSchema);