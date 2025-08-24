"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const __1 = require("..");
function home(req, res) {
    const filePath = path_1.default.join(__1.dirname, "public/index.html");
    res.sendFile(filePath);
}
exports.default = home;
