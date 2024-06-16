import express from 'express';
import * as users from '../controllers/users';
import authenticate from '../middleware/authentication';
import upload from '../middleware/multer';

const router = express.Router();

router.get("/me", authenticate, users.me);
router.get("/all", users.allUsers);
router.get("/", authenticate, users.getUserByCPin);
router.get("/:id", authenticate, users.getUserById);
router.put("/me", authenticate, upload.single("picture"), users.updateUser);
router.delete("/me/picture", authenticate, users.deleteProfilePicture);

export default router;