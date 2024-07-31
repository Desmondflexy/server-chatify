"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const helpers_1 = require("./helpers");
function connectSocket(app) {
    const io = new socket_io_1.Server(app, { cors: { origin: "*" } });
    (0, helpers_1.devLog)("Socket.io server started");
    io.on("connection", socket => {
        socket.on("fetchChats", function (data) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const { userId } = data;
                    const chats = yield Chat_1.default
                        .find({ members: userId })
                        .sort({ updatedAt: -1 })
                        .populate('messages members');
                    function truncateMessage(text, n) {
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
                        }
                        else if (chat.members.length > 1) {
                            const user = chat.members.find(i => i.id !== userId);
                            result.chatName = user === null || user === void 0 ? void 0 : user.displayName;
                            result.picture = user === null || user === void 0 ? void 0 : user.picture;
                        }
                        else {
                            result.chatName = `${chat.members[0].displayName} (You)`;
                            result.picture = chat.members[0].picture;
                        }
                        return result;
                    });
                    socket.emit("receivedChats", formattedChats);
                }
                catch (error) {
                    (0, helpers_1.devLog)(error);
                    socket.emit('error', { error: 'Internal server error. Please try again later.' });
                }
            });
        });
        socket.on("fetchChatMessages", function (data) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const { chatId, userId } = data;
                    const chat = yield Chat_1.default.findById(chatId)
                        .populate({
                        path: 'messages',
                        select: 'text sender createdAt',
                        populate: {
                            path: 'sender',
                            select: 'displayName picture'
                        }
                    });
                    if (!chat)
                        return;
                    socket.emit("receivedChatMessages", {
                        chatName: yield (0, helpers_1.getChatName)(chat, userId),
                        messages: chat.messages
                    });
                }
                catch (error) {
                    (0, helpers_1.devLog)(error);
                    socket.emit('error', { error: 'Internal server error. Please try again later.' });
                }
            });
        });
        socket.on("joinChat", chatId => socket.join(chatId));
        socket.on("sendMessage", (data) => __awaiter(this, void 0, void 0, function* () {
            const { chatId, userId, text } = data;
            try {
                const chat = yield Chat_1.default.findById(chatId);
                if (!chat)
                    return;
                const newMessage = new Message_1.default({ text, sender: userId });
                chat.messages.push(newMessage.id);
                yield newMessage.save();
                yield chat.save();
                io.to(chatId).emit('receiveMessage', yield newMessage.populate('sender'));
            }
            catch (error) {
                (0, helpers_1.devLog)(error);
                socket.emit('error', { error: 'Internal server error. Please try again later.' });
            }
        }));
        socket.on("error", error => (0, helpers_1.devLog)(error));
    });
}
exports.default = connectSocket;
