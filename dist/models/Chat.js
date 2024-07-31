"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    messages: [{
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: "Message",
        }],
    members: [{
            type: mongoose_1.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }],
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Chat", chatSchema);
