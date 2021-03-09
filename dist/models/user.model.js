"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        required: "No id",
    },
    username: {
        type: String,
        required: "No username",
        min: 6,
        max: 22
    },
    email: {
        type: String,
        required: "No email",
        min: 6,
        max: 40
    },
    password: {
        type: String,
        required: "No password",
        min: 8,
        max: 50
    },
    acceptedTerms: {
        type: Boolean,
        required: "No acceptedTerms",
    },
    hasRequiredAge: {
        type: Boolean,
        required: "No hasRequiredAge",
    }
});
const UserModel = mongoose_1.default.model('User', userSchema);
exports.default = UserModel;
