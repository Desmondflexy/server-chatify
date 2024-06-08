import { Server } from "socket.io";
import Chat from "../models/chat";
import Message from "../models/message";
import { devLog, getChatName } from "./helpers";

export default function connectSocket(app: any) {
    const io = new Server(app, { cors: { origin: "*" } });
    devLog("Socket.io server started");

    io.on("connection", socket => {
        socket.on("fetchChats", async function (data: { userId: string }) {
            try {
                const { userId } = data;
                const chats = await Chat
                    .find({ members: userId })
                    .sort({ updatedAt: -1 })
                    .populate('messages members');

                function truncateMessage(text:string, n:number) {
                    return text.length > n ? text.substring(0, n - 1) + '...' : text;
                }

                const formattedChats = chats.map(chat => {
                    const lastMessage = chat.messages[chat.messages.length - 1].text;
                    const result = {
                        id: chat.id,
                        chatName: "",
                        picture: "",
                        lastMessage: truncateMessage(lastMessage, 20),
                        time: chat.updatedAt,
                    };
                    if (chat.members.length > 2) {
                        result.chatName = "GroupName";
                    } else if (chat.members.length > 1) {
                        const user = chat.members.find(i => i.id !== userId);
                        result.chatName = user?.displayName as string;
                        result.picture = user?.picture as string;
                    } else {
                        result.chatName = `${chat.members[0].displayName} (You)`;
                        result.picture = chat.members[0].picture;
                    }
                    return result;
                });
                socket.emit("receivedChats", formattedChats);
            } catch (error) {
                devLog(error);
            }
        });
        socket.on("fetchChatMessages", async function (data: { chatId: string, userId: string }) {
            try {
                const { chatId, userId } = data;
                const chat = await Chat.findById(chatId)
                    .populate({
                        path: 'messages',
                        select: 'text sender createdAt',
                        populate: {
                            path: 'sender',
                            select: 'displayName picture'
                        }
                    });
                if (!chat) return;
                socket.emit("receivedChatMessages", {
                    chatName: await getChatName(chat, userId),
                    messages: chat.messages
                });


            } catch (error) {
                devLog(error);
            }
        });
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
        });
    });
}
