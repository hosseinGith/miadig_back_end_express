"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
const home_1 = __importDefault(require("./home"));
const utils_1 = require("../utils");
const auth_1 = __importDefault(require("./auth/auth"));
function routes(app) {
    // get home page content
    app.use("/auth", auth_1.default);
    app.get("/", utils_1.authenticateToken, home_1.default);
}
