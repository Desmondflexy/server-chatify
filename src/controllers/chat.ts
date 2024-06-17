import { Response, Request, NextFunction } from "express";
import { errorHandler } from "../utils/helpers";
import Chat from "../models/chat";
import Message from "../models/Message";
import User, { IUser } from "../models/User";


// start a new chat
export async function startChat(req: Request, res: Response) {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const friend = req.body.friend as IUser;
        if (!user) return res.status(404).json({
            error: "User not found"
        });
        const { text } = req.body;
        if (!text) return res.status(400).json({
            message: "Message is required"
        });

        const newMessage = new Message({ text, sender: userId });
        // allow user to chat self i.e one member in the chat
        const members = [userId];
        if (userId !== friend.id) members.push(friend.id);
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
        const { friend } = req.body;
        const userId = req.user.id;

        // check if chat already exists
        const memberIds = Array.from(new Set([friend.id, userId]));
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

export async function findChatWithuser(req: Request, res: Response) {
    try {
        const { friend } = req.body;
        const userId = req.user.id;
        const memberIds = Array.from(new Set([friend.id, userId]));
        const chat = await Chat.findOne({
            $and: [
                { members: { $all: memberIds } },
                { members: { $size: memberIds.length } }
            ]
        });
        if (chat) {
            res.json(chat.id);
        } else res.json(null);
    } catch (error) {
        errorHandler(res, error);
    }
}

export async function allChats(req: Request, res: Response) {
    try {
        const chats = await Chat.find({ members: req.user.id }).populate('members', 'displayName picture');
        return res.json(chats);
    } catch (error) {
        errorHandler(res, error);
    }
}