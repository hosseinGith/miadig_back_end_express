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
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { gmail } = req.body;
            // checking gmail with switch
            switch (true) {
                // empty gmail
                case !gmail:
                    return res.status(utils_1.status_types.auth).json({
                        message: "gmail required.",
                    });
                // gmail syntax check
                case !(gmail === null || gmail === void 0 ? void 0 : gmail.includes("@")) && !(gmail === null || gmail === void 0 ? void 0 : gmail.includes(".com")):
                    return res.status(utils_1.status_types.auth).json({
                        message: "gmail incorrect.",
                    });
            }
            // generate code with length from env
            const code = (0, utils_1.createRandOTP)(Number(utils_1.env_data.OTP_LENGTH) || 6);
            console.log(code);
            // const sendMailResult = await sendMail(gmail, code, "text");
            const sendMailResult = true;
            if (sendMailResult) {
                const otp = new otp_1.Otp();
                const result = yield otp.set(gmail, (0, utils_1.encrypt)(String(code)));
                if (result)
                    return res
                        .status(utils_1.status_types.ok)
                        .json({ tiem: utils_1.env_data.OTP_TIME_EXPIRE });
            }
            res.status(utils_1.status_types.system).json({
                message: utils_1.messages_response.system,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.default = login;
