import express from 'express';

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.send("Welcome to the chat app");
});

export default router;
