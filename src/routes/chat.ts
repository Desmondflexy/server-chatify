import express from 'express';
import * as chat from '../controllers/chat';
import authenticate from '../middleware/authentication';
import { getFriendByCPin } from '../controllers/users';

const router = express.Router();

router.post('/new', authenticate, getFriendByCPin, chat.checkIfChatExists, chat.startChat);
router.get('/', authenticate, getFriendByCPin, chat.findChatWithuser);
router.get('/all', authenticate, chat.allChats);
// router.delete('/:chatId', authenticate, chat.deleteChatForUser);
// router.delete('/message/:messageId', authenticate, chat.deleteChatMessageForUser);

export default router;
