"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.googleSignOn = exports.login = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const joi = __importStar(require("../utils/joi-validators"));
const helpers_1 = require("../utils/helpers");
const jwt_1 = require("../utils/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { value, error } = joi.signup.validate(req.body);
            if (error)
                return res.status(400).json(error.message);
            let user = yield User_1.default.findOne({ email: value.email });
            if (user)
                return res.status(409).json({ error: "Email has been used" });
            user = yield User_1.default.create(Object.assign(Object.assign({}, value), { password: yield bcryptjs_1.default.hash(value.password, 10), cPin: yield (0, helpers_1.generateChatifyId)() }));
            res.status(201).json({
                message: `User ${user.displayName} created successfully!`,
                userId: user.id
            });
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.signup = signup;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { value, error } = joi.login.validate(req.body);
            if (error)
                return res.status(400).json({ error: error.message });
            const user = yield User_1.default.findOne({ email: value.email });
            if (!user)
                return res.status(401).json({ error: "Invalid credentials!" });
            const isValid = yield bcryptjs_1.default.compare(value.password, user.password);
            if (!isValid)
                return res.status(401).json({ error: "Invalid credentials!" });
            const token = (0, jwt_1.generateToken)(user);
            (0, jwt_1.attachToken)(token, res);
            res.json({ message: "Login successful", token });
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.login = login;
/**Sign in with Google. User id, email and name is sent from the client */
function googleSignOn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { value, error } = joi.googleSignOn.validate(req.body);
            if (error)
                return res.status(400).json({ error: error.message });
            let user = yield User_1.default.findOne({ email: value.email });
            if (!user) {
                user = yield User_1.default.create({
                    email: value.email,
                    displayName: value.name,
                    ssoId: value.id,
                    ssoProvider: "Google",
                    cPin: yield (0, helpers_1.generateChatifyId)()
                });
            }
            else if (!user.ssoProvider) {
                // user exists but has not signed in with Google before
                user.ssoProvider = "Google";
                user.ssoId = value.id;
                yield user.save();
            }
            const token = (0, jwt_1.generateToken)(user);
            (0, jwt_1.attachToken)(token, res);
            res.json({ message: "Login successful", token });
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.googleSignOn = googleSignOn;
// logout for postman
function logout(req, res) {
    res.clearCookie("token");
    res.json({
        message: "Logout successful",
    });
}
exports.logout = logout;
