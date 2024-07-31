"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.startChat = exports.createChatRoom = exports.googleSignOn = exports.login = exports.signup = exports.options = void 0;
const joi_1 = __importDefault(require("joi"));
exports.options = {
    abortEarly: false,
    errors: { wrap: { label: "" } },
};
exports.signup = joi_1.default.object().keys({
    displayName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phone: joi_1.default.string().required(),
    password: joi_1.default.string().min(6).required(),
    confirm: joi_1.default
        .string()
        .valid(joi_1.default.ref("password"))
        .required()
        .messages({ "any.only": "Passwords do not match" }),
});
exports.login = joi_1.default.object().keys({
    email: joi_1.default.string().email().required().trim(),
    password: joi_1.default.string().required(),
});
exports.googleSignOn = joi_1.default.object().keys({
    id: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    name: joi_1.default.string().required(),
});
exports.createChatRoom = joi_1.default.object().keys({
    name: joi_1.default.string().required(),
    description: joi_1.default.string(),
    picture: joi_1.default.string(),
});
exports.startChat = joi_1.default.object().keys({
    message: joi_1.default.string().required,
    email: joi_1.default.string().required,
});
exports.updateProfile = joi_1.default.object().keys({
    displayName: joi_1.default.string(),
    phone: joi_1.default.string(),
    picture: joi_1.default.string(),
});
