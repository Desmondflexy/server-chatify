"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const auth_1 = __importDefault(require("./routes/auth"));
const chat_1 = __importDefault(require("./routes/chat"));
const database_1 = __importDefault(require("./config/database"));
const socket_1 = __importDefault(require("./utils/socket"));
const helpers_1 = require("./utils/helpers");
dotenv_1.default.config();
(0, database_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use("/", index_1.default);
app.use("/users", users_1.default);
app.use("/auth", auth_1.default);
app.use("/chat", chat_1.default);
// Handle 404 Not Found
app.use("/*", (req, res) => {
    res.status(404).json("Endpoint not found");
});
const PORT = process.env.PORT || 3000;
const expressServer = app.listen(PORT, () => {
    (0, helpers_1.devLog)(`Server is running on port http://localhost:${PORT}`);
});
(0, socket_1.default)(expressServer);
