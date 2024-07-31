"use strict";
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
exports.deleteFromCloud = exports.upload2cloud = exports.getChatName = exports.generateChatifyId = exports.devLog = exports.errorHandler = void 0;
const cloudinary_1 = require("../config/cloudinary");
const User_1 = __importDefault(require("../models/User"));
/** Returns internal server error message with status code 500 */
function errorHandler(res, error) {
    devLog(error.message);
    res.status(500).json({ error: "Internal Server Error!" });
}
exports.errorHandler = errorHandler;
/** Log messages only in development mode */
function devLog(message) {
    if (process.env.NODE_ENV !== "production") {
        console.log(message);
    }
}
exports.devLog = devLog;
/**Generate unique chatify id to give to other users to chat with you*/
function generateChatifyId() {
    return __awaiter(this, void 0, void 0, function* () {
        const generate = () => {
            const characters = '0123456789ABCDEFGH';
            let cPin = '';
            for (let i = 0; i < 8; i++) {
                cPin += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return cPin;
        };
        let cPin = generate();
        let user = yield User_1.default.findOne({ cPin });
        while (user) {
            cPin = generate();
            user = yield User_1.default.findOne({ cPin });
        }
        return cPin;
    });
}
exports.generateChatifyId = generateChatifyId;
/** Returns the chat name based on the number of members */
function getChatName(chat, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        chat = yield chat.populate('members');
        if (chat.members.length > 2)
            return "GroupName";
        if (chat.members.length > 1)
            return (_a = chat.members.find(i => i.id !== userId)) === null || _a === void 0 ? void 0 : _a.displayName;
        return `${chat.members[0].displayName} (You)`;
    });
}
exports.getChatName = getChatName;
/**Upload image on imagePath to cloudinary and returns image url */
function upload2cloud(imagePath_1) {
    return __awaiter(this, arguments, void 0, function* (imagePath, folder = "chatify") {
        const cloudinary = (0, cloudinary_1.configCloudinary)();
        if (!imagePath)
            return "";
        try {
            const result = yield cloudinary.uploader.upload(imagePath, { folder });
            const imageUrl = result.secure_url;
            return imageUrl;
        }
        catch (error) {
            devLog(error);
            throw new Error("Image upload failed! Please try again.");
        }
    });
}
exports.upload2cloud = upload2cloud;
/**Deletes image in imageUrl from cloudinary */
function deleteFromCloud(imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const cloudinary = (0, cloudinary_1.configCloudinary)();
        try {
            // Extract the public ID from the image URL
            const urlParts = imageUrl.split('/');
            const publicIdWithExtension = urlParts.slice(-2).join('/'); // includes folder and file name with extension
            const publicId = publicIdWithExtension.split('.')[0]; // removes the file extension
            const deletionResponse = yield cloudinary.uploader.destroy(publicId);
            if (deletionResponse.result === "ok") {
                console.log("Image deleted successfully");
            }
            else {
                console.warn("Image deletion failed", deletionResponse);
            }
        }
        catch (error) {
            console.warn("Error deleting image", error);
        }
    });
}
exports.deleteFromCloud = deleteFromCloud;
