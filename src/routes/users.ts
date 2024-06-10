import express from 'express';
import * as users from '../controllers/users';
import authenticate from '../middleware/authentication';

const router = express.Router();

router.get("/me", authenticate, users.me);
router.get("/all", users.allUsers);
router.get("/", authenticate, users.getUserByEmail);
router.get("/:id", authenticate, users.getUserById);

export default router;