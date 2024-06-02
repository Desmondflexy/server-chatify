import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import indexRouter from "./routes/index";
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import chatsRouter from './routes/chat';
import connectDB from './config/database';
import connectSocket from "./utils/socket";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/chat", chatsRouter);

// Handle 404 Not Found
app.use("/*", (req, res) => {
    res.status(404).json("Endpoint not found");
});

const PORT = process.env.PORT || 3000;
const expressServer = app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

connectSocket(expressServer);