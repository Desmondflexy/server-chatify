import {model, Schema, Document} from "mongoose";
import { IUser } from "./User";

export interface IMessage extends Document {
    text: string;
    sender: IUser;
}

const messageSchema = new Schema<IMessage>({
    text: {
        type: String,
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
}, {
    timestamps: true,
});

export default model<IMessage>('Message', messageSchema);