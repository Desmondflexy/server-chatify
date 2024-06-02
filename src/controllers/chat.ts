import { Response, Request, NextFunction } from "express";
import { errorHandler } from "../utils/helpers";
import Chat from "../models/chat";
import Message from "../models/message";

// start a new chat

export async function startChat(req: Request, res: Response) {
    try {
        const { friendId } = req.params;
        const userId = req.user.id;
        const { text } = req.body;
        if (!text) return res.status(400).json({
            message: "Message is required"
        });

        const newMessage = new Message({ text, sender: userId });
        // allow user to chat self i.e one member in the chat
        const members = [userId];
        if (userId !== friendId) members.push(friendId);
        const newChat = new Chat({
            messages: [newMessage.id],
            members
        });
        await newChat.save();
        await newMessage.save();
        return res.json({
            message: "new chat started",
            chatId: newChat.id
        });
    } catch (error) {
        return errorHandler(res, error);
    }
}

// check if chat with friend already exist
export async function checkIfChatExists(req: Request, res: Response, next: NextFunction) {
    try {
        const { friendId } = req.params;
        const userId = req.user.id;

        // check if chat already exists
        const memberIds = Array.from(new Set([friendId, userId]));
        const chat = await Chat.findOne({
            $and: [
                { members: { $all: memberIds } },
                { members: { $size: memberIds.length } }
            ]
        });
        if (chat) {
            return res.status(409).json({
                message: "chat already exists", chatId: chat.id
            });
        }
        next();
    } catch (error) {
        errorHandler(res, error);
    }
}


// get all chats for a user
export async function getUserChats(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const chats = await Chat.find({ members: userId })
            .select('members')
            .populate('members', 'displayName picture')
            .sort({ updatedAt: -1 });

        const formattedChats = chats.map(chat => {
            if (chat.members.length === 1) {
                return {
                    id: chat.id,
                    chatName: `${chat.members[0].displayName} (You)`
                };
            } else if (chat.members.length === 2) {
                return {
                    id: chat.id,
                    chatName: chat.members.find(i => i.id !== userId)?.displayName
                };
            } else {
                return {
                    id: chat.id,
                    chatName: "GroupName"
                };
            }
            return chat
        });

        return res.json(formattedChats);

    } catch (error) {
        return errorHandler(res, error);
    }
}

export async function getChatMessages(req: Request, res: Response) {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;
        const chat = await Chat.findOne({ _id: chatId, members: userId })
            .populate({
                path: 'messages',
                select: 'text sender createdAt',
                populate: {
                    path: 'sender',
                    select: 'displayName picture'
                }
            });
        if (!chat) return res.status(404).json("Chat not found");

        return res.json(chat.messages);
    } catch (error) {
        return errorHandler(res, error);
    }
}