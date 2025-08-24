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
exports.secret_keys = exports.authSettings = exports.messages_response = exports.status_types = exports.mySqlData = exports.env_data = void 0;
exports.default = settings;
exports.setConection = setConection;
exports.authenticateToken = authenticateToken;
exports.createKey = createKey;
exports.sendMail = sendMail;
exports.createRandOTP = createRandOTP;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
exports.env_data = {
    PORT: process.env.PORT,
    MAIN_DATABASE: process.env.MAIN_DATABASE,
    PASSWORD: process.env.PASSWORD,
    PRODUCTS_DATABASE: process.env.PRODUCTS_DATABASE,
    USER: process.env.USER,
    HOST: process.env.HOST,
    SECRET_KEY: process.env.SECRET_KEY,
    SECRET_KEY_IV: process.env.SECRET_KEY_IV,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_KEY: process.env.EMAIL_KEY,
    OTP_LENGTH: process.env.OTP_LENGTH,
    OTP_TIME_EXPIRE: process.env.OTP_TIME_EXPIRE,
};
exports.mySqlData = {
    database: exports.env_data.MAIN_DATABASE,
    password: exports.env_data.PASSWORD,
    products: exports.env_data.PRODUCTS_DATABASE,
    user: exports.env_data.USER,
    host: exports.env_data.HOST,
};
exports.status_types = {
    ok: 200,
    created: 201,
    auth: 403,
    notFound: 404,
    system: 500,
};
exports.messages_response = {
    system: "System Error",
};
exports.authSettings = {
    codeLength: 5,
};
exports.secret_keys = [
    exports.env_data.SECRET_KEY || "",
    exports.env_data.SECRET_KEY_IV || "",
];
function settings(app) {
    app.use(express_1.default.static("public"));
    const limit = (0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "درخواست های زیاد <br> <br> <br> <br> لطفا چن دقیقه دیگر تلاش کنید.",
    });
    app.use(limit);
    app.use(express_1.default.json());
    app.use((err, req, res, next) => {
        console.log(err);
        if (err)
            res.status(exports.status_types.system).json({
                message: exports.messages_response.system,
            });
    });
}
function setConection(mySqlCon_1, sql_1, params_1) {
    return __awaiter(this, arguments, void 0, function* (mySqlCon, sql, params, database = exports.mySqlData.database || "") {
        const connection = yield mySqlCon(database);
        const result = connection.query(sql, params);
        connection.destroy();
        return result;
    });
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.sendStatus(401);
    }
    jsonwebtoken_1.default.verify(token, exports.env_data.SECRET_KEY || "", (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = decoded;
        next();
    });
}
function createKey(payLoad) {
    if (!exports.env_data.SECRET_KEY)
        return;
    return jsonwebtoken_1.default.sign(payLoad, exports.env_data.SECRET_KEY, {
        expiresIn: "1h",
    });
}
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: exports.env_data.EMAIL_USER,
        pass: exports.env_data.EMAIL_KEY,
    },
});
function sendMail(to, text, subject) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailOptions = {
            from: `info@miradig.ir`,
            to,
            subject,
            text,
        };
        try {
            yield transporter.sendMail(mailOptions);
            return true;
        }
        catch (error) {
            return false;
        }
    });
}
function createRandOTP(length) {
    return crypto_1.default.randomInt(Math.pow(10, (length - 1)), Math.pow(10, length)).toString();
}
function encrypt(text, keys_ = exports.secret_keys) {
    let encrypted;
    try {
        const cipher = crypto_1.default.createCipheriv("aes-256-cbc", Buffer.from(keys_[0], "hex"), Buffer.from(keys_[1], "hex"));
        encrypted = cipher.update(text, "utf8", "hex");
        encrypted += cipher.final("hex");
        return encrypted;
    }
    catch (e) {
        return "";
    }
}
function decrypt(encrypted, keys_ = exports.secret_keys) {
    try {
        const decipher = crypto_1.default.createDecipheriv("aes-256-cbc", Buffer.from(keys_[0], "hex"), Buffer.from(keys_[1], "hex"));
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");
        return decrypted;
    }
    catch (e) {
        return "";
    }
}
