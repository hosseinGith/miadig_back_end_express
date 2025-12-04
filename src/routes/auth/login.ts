import fs from "fs";
import { Request, Response } from "express-serve-static-core";
import {
  createHashkey,
  createRandOTP,
  encrypt,
  env_data,
  messages_response,
  sendMail,
  status_types,
} from "../../utils";
import { Otp } from "../../components/otp";
import path from "path";
import { dirname } from "../..";
import z from "zod";

async function login(req: Request, res: Response) {
  try {
    let htmlSend = fs
      .readFileSync(path.join(dirname, "public", "gmailSend.html"))
      .toString();
    const { gmail }: { gmail: string } = req.body;
    if (!z.email().safeParse(gmail).success || !gmail) {
      return res.status(status_types.badReqeust).json({
        messages: ["Invalid email address"],
        keys: ["email"],
      });
    }

    // generate code with length from env
    const code = createRandOTP(Number(env_data.OTP_LENGTH) || 6);
    // send code
    const result = await sendMail(
      gmail,
      htmlSend.replace("{title}", "Login code is: ").replace("{value}", code),
      process.env.WebSite
    );
    if (result) {
      const { secretKey, token } = createHashkey(gmail);
      const otp = new Otp();
      const result = await otp.set(gmail, encrypt(String(code)), secretKey);

      res.cookie("temporary", token, {
        expires: new Date(Date.now() + 220 * 10000),
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      });
      if (result) {
        return res
          .status(status_types.ok)
          .json({ time: env_data.OTP_TIME_EXPIRE });
      }
    }

    res.status(status_types.system).json({
      message: messages_response.system,
    });
  } catch (error) {
    console.error(error);
  }
}

export default login;
