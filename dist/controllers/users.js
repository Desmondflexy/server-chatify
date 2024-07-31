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
exports.profile = exports.deleteUserById = exports.getFriendByCPin = exports.deleteProfilePicture = exports.updateUser = exports.getUserById = exports.getUserByCPin = exports.allUsers = exports.me = void 0;
const helpers_1 = require("../utils/helpers");
const User_1 = __importDefault(require("../models/User"));
const joi = __importStar(require("../utils/joi-validators"));
function me(req, res) {
    return res.json(req.user);
}
exports.me = me;
function allUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield User_1.default.find().select('email displayName phone cPin');
            return res.json({
                noOfUsers: users.length,
                users,
            });
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.allUsers = allUsers;
function getUserByCPin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { cPin } = req.query;
            const user = yield User_1.default.findOne({ cPin }).select('email displayName phone cPin picture');
            if (!user)
                return res.status(404).json({ error: "User not found" });
            return res.json(user);
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.getUserByCPin = getUserByCPin;
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const user = yield User_1.default.findById(id).select('email displayName phone picture cPin');
            if (!user)
                return res.status(404).json({ error: "User not found" });
            return res.json(user);
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.getUserById = getUserById;
// controller to update displayName, phone or picture
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error, value } = joi.updateProfile.validate(req.body);
            if (error)
                return res.status(400).json({ error: error.message });
            const userId = req.user.id;
            const user = (yield User_1.default.findById(userId));
            if (value.displayName)
                user.displayName = value.displayName;
            if (value.phone)
                user.phone = value.phone;
            // update profile picture
            if (req.file) {
                if (req.file.size > 3 * 1000 * 1000) {
                    return res.status(400).json({
                        error: "Picture size should not exceed 3 MB",
                    });
                }
                if (user.picture)
                    yield (0, helpers_1.deleteFromCloud)(user.picture);
                user.picture = yield (0, helpers_1.upload2cloud)(req.file.path);
            }
            yield user.save();
            return res.json(user);
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.updateUser = updateUser;
function deleteProfilePicture(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = (yield User_1.default.findById(req.user.id));
            if (!user.picture)
                return res.status(400).json({ error: "Profile picture not found" });
            yield (0, helpers_1.deleteFromCloud)(user.picture);
            user.picture = "";
            yield user.save();
            return res.json(user);
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.deleteProfilePicture = deleteProfilePicture;
function getFriendByCPin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cPin = req.query.cPin;
            if (!cPin)
                return res.status(400).json({ error: "Chatify pin is required in the query params" });
            const user = yield User_1.default.findOne({ cPin: cPin.toUpperCase() });
            if (!user)
                return res.status(404).json({ error: "User not found" });
            req.body.friend = user;
            next();
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.getFriendByCPin = getFriendByCPin;
function deleteUserById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.id;
        try {
            const user = yield User_1.default.findById(userId);
            if (!user)
                return res.status(404).json({ error: "user not found" });
            user.deleteOne();
            res.json("user deleted successfully");
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.deleteUserById = deleteUserById;
function profile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user.id;
        try {
            const user = yield User_1.default.findById(userId);
            if (!user)
                return res.status(404).json({ error: "user not found" });
            res.json(user);
        }
        catch (error) {
            (0, helpers_1.errorHandler)(res, error);
        }
    });
}
exports.profile = profile;
