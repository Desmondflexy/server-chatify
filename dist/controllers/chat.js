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
exports.allChats = exports.findChatWithuser = exports.checkIfChatExists = exports.startChat = void 0;
const helpers_1 = require("../utils/helpers");
const Chat_1 = __importDefault(require("../models/Chat"));
const Message_1 = __importDefault(require("../models/Message"));
const User_1 = __importDefault(require("../models/User"));
// start a new chat
function startChat(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.user.id;
            const user = yield User_1.default.findById(userId);
            const friend = req.body.friend;
            if (!user)
                return res.status(404).json({
                    error: "User not found"
                });
            const { text } = req.body;
            if (!text)
                return res.status(400).json({
                    message: "Message is required"
                });
            const newMessage = new Message_1.default({ text, sender: userId });
            // allow user to chat self i.e one member in the chat
            const members = [userId];
            if (userId !== friend.id)
                members.push(friend.id);
            const newChat = new Chat_1.default({
                messages: [newMessage.id],
                members
            });
            yield newChat.save();
            yield newMessage.save();
            return res.json({
                message: "new chat started",
                chatId: newChat.id
            });
        }
        catch (error) {
            return (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.startChat = startChat;
// check if chat with friend already exist
function checkIfChatExists(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { friend } = req.body;
            const userId = req.user.id;
            // check if chat already exists
            const memberIds = Array.from(new Set([friend.id, userId]));
            const chat = yield Chat_1.default.findOne({
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
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.checkIfChatExists = checkIfChatExists;
function findChatWithuser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { friend } = req.body;
            const userId = req.user.id;
            const memberIds = Array.from(new Set([friend.id, userId]));
            const chat = yield Chat_1.default.findOne({
                $and: [
                    { members: { $all: memberIds } },
                    { members: { $size: memberIds.length } }
                ]
            });
            if (chat) {
                res.json(chat.id);
            }
            else
                res.json(null);
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.findChatWithuser = findChatWithuser;
function allChats(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const chats = yield Chat_1.default.find({ members: req.user.id }).populate('members', 'displayName picture');
            return res.json(chats);
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.allChats = allChats;
