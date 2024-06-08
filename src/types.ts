import { Document } from "mongoose";

export interface IMessage extends Document {
    text: string;
    sender: IUser;
}

export interface IUser extends Document {
    email: string;
    password?: string;
    displayName: string;
    picture: string;
    phone: string;
    ssoId: string;
    ssoProvider: string;
}

export interface IChat extends Document {
    messages: IMessage[];
    members: IUser[];
    createdAt: Date;
    updatedAt: Date;
}