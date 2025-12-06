import { NextFunction, Request, Response } from "express-serve-static-core";
import {
  decrypt,
  env_data,
  sendMail,
  status_types,
  verifyToken,
} from "../../utils";
import { Otp } from "../../components/otp";
import { z } from "zod";
import { Users } from "../../components/user";

const CodeSchema = z.object({
  gmail: z.email(""),
  code: z
    .number()
    .int()
    .refine(
      (val) => val >= 100000 && val <= 999999,
      "code invilde . most be of 6 numbers"
    ),
});
async function verifyCode(req: Request, res: Response) {
  try {
    const { gmail, code }: { gmail: string; code: string } = req.body;
    const verifyData = CodeSchema.safeParse(req.body);

    // check user gmail
    if (!verifyData.success) {
      const flattened = verifyData.error.flatten();
      const messages = Object.values(flattened.fieldErrors).flat();
      return res
        .status(status_types.badReqeust)
        .json({ messages, keys: Object.keys(flattened.fieldErrors).flat() });
    }
    // check user gmail
    const otp = new Otp();
    const result = await otp.get(gmail);
    const otp_data = result[0];
    if (!result[0]) {
      return res.status(status_types.badReqeust).json({
        messages: ["Invalid email address"],
        keys: ["email"],
      });
    }
    const db_code = decrypt(otp_data.otp_code);

    let timeDelta = Date.now() - new Date(otp_data.time).getTime();

    // convert ms => s
    timeDelta = timeDelta / 1000;

    const dateCheckReusult = timeDelta <= Number(env_data.OTP_TIME_EXPIRE);

    const { temporary } = req.cookies;

    // delete user gmail and code
    // set user
    const [temporarySecret] = await otp.get(gmail);
    if (!temporary || typeof temporarySecret !== "object") return res;

    await otp.remove(gmail);
    const users = new Users();
    if (
      Number(db_code) === Number(code) &&
      verifyToken(temporary, temporarySecret.temporaryKey)
    ) {
      // remove gmail after login
      const { token, result } = await users.set(gmail);

      if (result) sendMail(gmail, "Login successfully", process.env.WebSite);
      else throw Error("System error");

      res.cookie(
        "key",
        { token, username: gmail },
        {
          expires: new Date(Date.now() + 1000 * 10 ** 3),
          httpOnly: true,
          sameSite: "lax",
          secure: false,
        }
      );
      res.cookie("temporary", "", {
        expires: new Date(),
      });

      return res.status(status_types.ok).json({
        message: "Welcome.",
      });
    } else {
      return res.status(status_types.badReqeust).json({
        messages: ["Code incorrect. Please try again"],
        keys: ["code"],
      });
    }
  } catch (error) {
    return res.status(status_types.system).json({
      messages: ["System error"],
      keys: ["system"],
    });
  }
}

export default verifyCode;
