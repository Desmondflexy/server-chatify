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
const mongoose_1 = __importDefault(require("mongoose"));
const helpers_1 = require("../utils/helpers");
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        let databaseUrl;
        if (process.env.NODE_ENV === "production")
            databaseUrl = process.env.DATABASE_URL;
        else if (process.env.NODE_ENV === "staging")
            databaseUrl = process.env.DATABASE_URL_TEST;
        else
            databaseUrl = "mongodb://localhost:27017/chatify";
        try {
            yield mongoose_1.default.connect(databaseUrl);
            (0, helpers_1.devLog)("Database connection successful");
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.default = connectDB;
