import { Response, Request, NextFunction } from "express";
import { errorHandler } from "../utils/helpers";
import { Chat, Message } from "./models";

// start a new chat

export async function startChat(req: Request, res: Response) {
  try {
    const { friendId } = req.params;
    const userId = req.user.id;
    const { text } = req.body;
    if (!text) return res.status(400).json("text is required");

    const newMessage = new Message({ text, sender: userId });
    const newChat = new Chat({
      messages: [newMessage.id],
      members: [userId, friendId]
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
    const chat = await Chat.findOne({
      members: { $all: [userId, friendId] }
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


// send message to a chat
export async function sendMessage(req: Request, res: Response) {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    const { text } = req.body;
    if (!text) return res.status(400).json("Message is required");
    const chat = await Chat.findOne({ _id: chatId, members: userId });
    if (!chat) return res.status(404).json("Chat not found");

    const newMessage = new Message({ text, sender: userId });
    chat.messages.push(newMessage.id);
    await newMessage.save();
    await chat.save();
    return res.json({ ...newMessage.toJSON(), sender: {...req.user, _id: req.user.id} });
  } catch (error) {
    return errorHandler(res, error);
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
      const chatName = chat.members.find(i => i._id.toString() !== userId)?.displayName;
      return {
        id: chat.id,
        chatName,
      };
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