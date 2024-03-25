"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ucenikSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    safetyq: String,
    safetya: String,
    name: String,
    surname: String,
    sex: String,
    adress: String,
    telephone: String,
    email: String,
    schooltype: String,
    schoolgrade: Number,
    profilePic: String,
});
exports.default = mongoose_1.default.model('UcenikModel', ucenikSchema, 'ucenik');
