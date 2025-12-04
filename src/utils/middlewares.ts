import { NextFunction, Request, Response } from "express";
import { env_data, status_types } from ".";
import jwt from "jsonwebtoken";
import { Users } from "../components/user";

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username, token } = req.cookies.key;

  if (!username || !token) {
    return res.sendStatus(status_types.auth);
  }
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
}
