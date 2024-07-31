"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
    },
    displayName: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
    },
    ssoId: {
        type: String,
    },
    ssoProvider: {
        type: String,
    },
    cPin: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('User', userSchema);
