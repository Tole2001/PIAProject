"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const casSchema = new mongoose_1.default.Schema({
    predmet: String,
    nastavnik: String,
    ucenik: String,
    opis: String,
    datumvreme: Date,
    datumvremekraj: Date,
    odrzan: Number,
    komentar: String,
    potvrdjen: Number,
    ocena: Number,
    potvrdaObavestenje: Number,
    otkazObavestenj: Number
});
exports.default = mongoose_1.default.model('CasModel', casSchema, 'casovi');
