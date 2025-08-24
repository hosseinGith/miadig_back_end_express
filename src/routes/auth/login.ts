import { NextFunction, Request, Response } from "express-serve-static-core";
import {
  createRandOTP,
  encrypt,
  env_data,
  messages_response,
  status_types,
} from "../../utils";
import { Otp } from "../../components/otp";

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { gmail }: { gmail?: string | undefined } = req.body;

    // checking gmail with switch
    switch (true) {
      // empty gmail
      case !gmail:
        return res.status(status_types.auth).json({
          message: "gmail required.",
        });

      // gmail syntax check
      case !gmail?.includes("@") && !gmail?.includes(".com"):
        return res.status(status_types.auth).json({
          message: "gmail incorrect.",
        });
    }

    // generate code with length from env
    const code = createRandOTP(Number(env_data.OTP_LENGTH) || 6);
    console.log(code);

    // const sendMailResult = await sendMail(gmail, code, "text");
    const sendMailResult = true;

    if (sendMailResult) {
      const otp = new Otp();

      const result = await otp.set(gmail, encrypt(String(code)));

      if (result)
        return res
          .status(status_types.ok)
          .json({ tiem: env_data.OTP_TIME_EXPIRE });
    }

    res.status(status_types.system).json({
      message: messages_response.system,
    });
  } catch (error) {
    next(error);
  }
}

export default login;
