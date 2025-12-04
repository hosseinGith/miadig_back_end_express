import { Connection } from "mysql2/promise";
import rateLimit from "express-rate-limit";
import express, { Application, NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import nodemailer from "nodemailer";
import cookieParser from "cookie-parser";
import crypto, { randomBytes } from "crypto";
import cors from "cors";
interface UserPayload extends JwtPayload {
  id: string;
}

declare module "express" {
  interface Request {
    user?: UserPayload;
  }
}

export const env_data = {
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

export const mySqlData = {
  database: env_data.MAIN_DATABASE,
  password: env_data.PASSWORD,
  products: env_data.PRODUCTS_DATABASE,
  user: env_data.USER,
  host: env_data.HOST,
};

export const status_types = {
  ok: 200,
  created: 201,
  badReqeust: 400,
  auth: 401,
  notFound: 404,
  system: 500,
};
export const messages_response = {
  system: "System Error",
};

export const authSettings = {
  codeLength: 5,
};
export const secret_keys = [
  env_data.SECRET_KEY || "",
  env_data.SECRET_KEY_IV || "",
];

export default function settings(app: Application) {
  app.use(express.static("public"));

  const limit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests. Please try later",
  });
  app.use(cookieParser("mySecretKey"));
  app.use(limit);
  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
}

export async function setConection(
  mySqlCon: (database: string | undefined) => Promise<Connection>,
  sql: string,
  params: string[],
  database: string = mySqlData.database || ""
) {
  const connection = await mySqlCon(database);

  const result = connection.query<any>(sql, params);
  connection.destroy();
  return result;
}

export function createKey(payLoad: { username: string }) {
  if (!env_data.SECRET_KEY) return;

  return jwt.sign(payLoad, env_data.SECRET_KEY, {
    expiresIn: "1h",
  });
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env_data.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

export async function sendMail(
  to: string,
  html: string,
  subject: string | undefined
) {
  const mailOptions = {
    from: env_data.EMAIL_USER,
    to,
    subject,
    html,
  };
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}

export function createRandOTP(length: number): string {
  return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
}

export function encrypt(text: string, keys_: string[] = secret_keys) {
  let encrypted;
  try {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(keys_[0], "hex"),
      Buffer.from(keys_[1], "hex")
    );
    encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (e) {
    return "";
  }
}

export function decrypt(encrypted: string, keys_: string[] = secret_keys) {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(keys_[0], "hex"),
      Buffer.from(keys_[1], "hex")
    );
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (e) {
    return "";
  }
}
export const createHashkey = (payload: string | Buffer | object) => {
  const secretKey = crypto.randomBytes(32).toString("hex");
  const token = jwt.sign(payload, secretKey);
  return { token, secretKey };
};

export const verifyToken = (token: string, secret: string) => {
  const result = jwt.verify(token, secret);
  return result;
};
