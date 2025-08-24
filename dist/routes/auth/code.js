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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const otp_1 = require("../../components/otp");
function code(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { gmail, code } = req.body;
            // checking code
            switch (true) {
                // empty gmail
                case !gmail || !code:
                    return res.status(utils_1.status_types.auth).json({
                        message: `${!gmail ? "gmail" : "code"} required.`,
                    });
                // gmail syntax check
                case !(gmail === null || gmail === void 0 ? void 0 : gmail.includes("@")) && !(gmail === null || gmail === void 0 ? void 0 : gmail.includes(".com")):
                    return res.status(utils_1.status_types.auth).json({
                        message: "gmail incorrect.",
                    });
                case String(code).length != Number(utils_1.env_data.OTP_LENGTH):
                    return res.status(utils_1.status_types.auth).json({
                        message: `code incorrect.`,
                    });
            }
            const otp = new otp_1.Otp();
            const result = yield otp.get(gmail);
            const otp_data = result[0];
            if (!result[0]) {
                return res.status(utils_1.status_types.auth).json({
                    message: "gmail incorrect",
                });
            }
            const db_code = (0, utils_1.decrypt)(otp_data.otp_code);
            let timeDelta = Date.now() - new Date(otp_data.time).getTime();
            // convert ms => s
            timeDelta = timeDelta / 1000;
            const dateCheckReusult = timeDelta <= Number(utils_1.env_data.OTP_TIME_EXPIRE);
            console.log(timeDelta);
            if (Number(db_code) === Number(code) && dateCheckReusult) {
                // remove gmail after login
                yield otp.remove(gmail);
                return res.status(utils_1.status_types.ok).json({
                    message: "Welcome.",
                });
            }
            else {
                yield otp.remove(gmail);
                return res.status(utils_1.status_types.auth).json({
                    message: "Code incorrect. Please try again",
                });
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.default = code;
