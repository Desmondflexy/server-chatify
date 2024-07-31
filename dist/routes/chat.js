"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat = __importStar(require("../controllers/chat"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const users_1 = require("../controllers/users");
const router = express_1.default.Router();
router.post('/new', authentication_1.default, users_1.getFriendByCPin, chat.checkIfChatExists, chat.startChat);
router.get('/', authentication_1.default, users_1.getFriendByCPin, chat.findChatWithuser);
router.get('/all', authentication_1.default, chat.allChats);
// router.delete('/:chatId', authenticate, chat.deleteChatForUser);
// router.delete('/message/:messageId', authenticate, chat.deleteChatMessageForUser);
exports.default = router;
