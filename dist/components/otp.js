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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Otp_columnName;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const _1 = require(".");
const utils_1 = require("../utils");
class Otp extends _1.Base_sql {
    constructor() {
        super(...arguments);
        _Otp_columnName.set(this, "otp_codes");
    }
    get(gmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield (0, utils_1.setConection)(this.connection, `SELECT * FROM  ${__classPrivateFieldGet(this, _Otp_columnName, "f")} WHERE gmail = BINARY ?`, [gmail]);
            return result;
        });
    }
    update(gmail, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield (0, utils_1.setConection)(this.connection, `UPDATE  ${__classPrivateFieldGet(this, _Otp_columnName, "f")} 
       SET otp_code = ?
       WHERE gmail = BINARY ?
       `, [code, gmail]);
            return result.affectedRows > 0;
        });
    }
    set(gmail, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkGmail = yield this.get(gmail);
            if (checkGmail.length > 0) {
                return this.update(gmail, code);
            }
            const [result] = yield (0, utils_1.setConection)(this.connection, `INSERT INTO ${__classPrivateFieldGet(this, _Otp_columnName, "f")} 
               ( gmail, otp_code)
              VALUES ( ? , ? ) `, [gmail, code]);
            return result.affectedRows > 0;
        });
    }
    remove(gmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield (0, utils_1.setConection)(this.connection, `DELETE FROM ${__classPrivateFieldGet(this, _Otp_columnName, "f")} 
        WHERE gmail = BINARY ?  `, [gmail]);
            return result.affectedRows > 0;
        });
    }
}
exports.Otp = Otp;
_Otp_columnName = new WeakMap();
