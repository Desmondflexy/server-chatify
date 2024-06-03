import { Server } from "socket.io";
import Chat from "../models/chat";
import Message from "../models/message";
import { devLog } from "./helpers";

export default function connectSocket(app: any) {
    const io = new Server(app, { cors: { origin: "*" } });
    devLog("Socket.io server started");

    io.on("connection", socket => {
        socket.on("joinChat", chatId => socket.join(chatId));
        socket.on("sendMessage", async data => {
            const { chatId, userId, text } = data;
            try {
                const chat = await Chat.findById(chatId);
                if (!chat) return
                const newMessage = new Message({ text, sender: userId });
                chat.messages.push(newMessage.id);
                await newMessage.save();
                await chat.save();
                io.to(chatId).emit('receiveMessage', await newMessage.populate('sender'));
            } catch (error) {
                devLog(error);
            }
        })
    });
}
