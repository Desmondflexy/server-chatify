import express from 'express';
import * as chat from '../controllers/chat';
import authenticate from '../middleware/authentication';

const router = express.Router();

router.post('/friend/:friendId', authenticate, chat.checkIfChatExists, chat.startChat);
// router.post('/:chatId/send', authenticate, chat.sendMessage);
router.get('/', authenticate, chat.getUserChats);
router.get('/:chatId', authenticate, chat.getChatMessages);

export default router;
