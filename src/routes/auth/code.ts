import { NextFunction, Request, Response } from "express-serve-static-core";
import { decrypt, env_data, status_types } from "../../utils";
import { Otp } from "../../components/otp";

async function code(req: Request, res: Response, next: NextFunction) {
  try {
    const { gmail, code }: { gmail: string; code: string | "" } = req.body;
    // checking code
    switch (true) {
      // empty gmail
      case !gmail || !code:
        return res.status(status_types.auth).json({
          message: `${!gmail ? "gmail" : "code"} required.`,
        });

      // gmail syntax check
      case !gmail?.includes("@") && !gmail?.includes(".com"):
        return res.status(status_types.auth).json({
          message: "gmail incorrect.",
        });

      case String(code).length != Number(env_data.OTP_LENGTH):
        return res.status(status_types.auth).json({
          message: `code incorrect.`,
        });
    }

    const otp = new Otp();
    const result = await otp.get(gmail);
    const otp_data = result[0];
    if (!result[0]) {
      return res.status(status_types.auth).json({
        message: "gmail incorrect",
      });
    }
    const db_code = decrypt(otp_data.otp_code);

    let timeDelta = Date.now() - new Date(otp_data.time).getTime();

    // convert ms => s
    timeDelta = timeDelta / 1000;

    const dateCheckReusult = timeDelta <= Number(env_data.OTP_TIME_EXPIRE);
    console.log(timeDelta);

    if (Number(db_code) === Number(code) && dateCheckReusult) {
      // remove gmail after login
      await otp.remove(gmail);

      return res.status(status_types.ok).json({
        message: "Welcome.",
      });
    } else {
      await otp.remove(gmail);

      return res.status(status_types.auth).json({
        message: "Code incorrect. Please try again",
      });
    }
  } catch (error) {
    next(error);
  }
}

export default code;
