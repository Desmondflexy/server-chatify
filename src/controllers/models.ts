import { Schema, Document, Types, model } from "mongoose";


export interface IUser extends Document {
  email: string;
  password?: string;
  displayName: string;
  picture: string;
  phone: string;
  ssoId: string;
  ssoProvider: string;
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

export const User = model<IUser>('User', userSchema);


export interface IChat extends Document {
  messages: IMessage[];
  members: IUser[];
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

export const Chat = model<IChat>("Chat", chatSchema);



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

export const Message = model<IMessage>('Message', messageSchema);

