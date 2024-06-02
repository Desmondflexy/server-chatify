import mongoose from "mongoose";
import { IChat } from "../types";

const chatSchema = new mongoose.Schema<IChat>({
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Message",
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }],
}, {
    timestamps: true,
});

export default mongoose.model<IChat>("Chat", chatSchema);