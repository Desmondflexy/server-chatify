import express from 'express';
import * as users from '../controllers/users';
import authenticate from '../middleware/authentication';
import upload from '../middleware/multer';

const router = express.Router();

router.get("/me", authenticate, users.me);
router.get("/all", users.allUsers);
router.get("/", authenticate, users.getUserByCPin);
router.put("/me", authenticate, upload.single("picture"), users.updateUser);
router.get("/me/profile", authenticate, users.profile);
router.delete("/me/picture", authenticate, users.deleteProfilePicture);
router.get("/:id", authenticate, users.getUserById);

export default router;