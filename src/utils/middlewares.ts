import { NextFunction, Request, Response } from "express";
import { env_data, status_types } from ".";
import jwt from "jsonwebtoken";
import { Users } from "../components/user";

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userKey = req.cookies.key;

    if (!userKey || !userKey?.username || !userKey?.token) {
      return res.sendStatus(status_types.auth);
    }
    const { username, token } = userKey;
    const users = new Users();
    const [{ user_key: secretKey }] = await users.get(username, "user_key");
    if (!secretKey) return res.sendStatus(status_types.auth);

    jwt.verify(token, secretKey, (err: jwt.VerifyErrors | null) => {
      if (err) {
        res.cookie("key", "");
        return res.sendStatus(status_types.auth);
      }
      next();
    });
  } catch (error) {
    return res.sendStatus(status_types.system);
  }
}
