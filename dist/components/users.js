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
exports.Users = void 0;
const crypto_1 = __importDefault(require("crypto"));
const _1 = require(".");
const utils_1 = require("../utils");
//
class Users extends _1.Base_sql {
    get(userDataRequested, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, utils_1.setConection)(this.connection, `SELECT  ${userDataRequested} FROM  users WHERE username = BINARY ?`, [username]);
            return result;
        });
    }
    set() {
        const user_key = crypto_1.default.randomBytes(32).toString("hex");
        const result = (0, utils_1.setConection)(this.connection, `INSERT INTO users 
         ( user_key, username, password)
        VALUES ( ? , ? , ?) 

          WHERE id = BINARY ?`, [user_key]);
        return result;
    }
    add(sql, params) { }
}
exports.Users = Users;
