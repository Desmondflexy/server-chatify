import {Document, Schema, model} from "mongoose";
import { IMessage } from "./Message";
import { IUser } from "./User";

export interface IChat extends Document {
    messages: IMessage[];
    members: IUser[];
    createdAt: Date;
    updatedAt: Date;
}

const chatSchema = new Schema<IChat>({
    messages: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Message",
    }],
    members: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    }],
}, {
    timestamps: true,
});

export default model<IChat>("Chat", chatSchema);