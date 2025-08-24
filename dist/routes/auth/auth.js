"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = __importDefault(require("./login"));
const code_1 = __importDefault(require("./code"));
const router = (0, express_1.Router)();
router.post("/login", login_1.default);
router.post("/login/code", code_1.default);
exports.default = router;
