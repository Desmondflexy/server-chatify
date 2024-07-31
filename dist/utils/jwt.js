"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**Token expiration in seconds */
const expiresIn = Number(process.env.JWT_EXPIRES_IN) * 3600;
// const expiresIn = 60 * 60;
const secretKey = process.env.JWT_SECRET;
/** Generate a token for the user on successful login */
function generateToken(user) {
    const jwtPayload = { id: user._id, displayName: user.displayName, email: user.email };
    return jsonwebtoken_1.default.sign(jwtPayload, secretKey, { expiresIn });
}
exports.generateToken = generateToken;
/** Verify the token sent by the user and returns the decoded token */
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, secretKey);
}
exports.verifyToken = verifyToken;
/** Attach the token to the authorization headers and save in cookies*/
function attachToken(token, res) {
    res.setHeader("Authorization", `Bearer ${token}`);
    res.cookie("token", token, { maxAge: expiresIn * 1000, httpOnly: true });
}
exports.attachToken = attachToken;
