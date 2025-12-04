import { Request, Response } from "express";
import { Users } from "../../../components/user";
import { status_types } from "../../../utils";

export default async function data(req: Request, res: Response) {
  try {
    const { username } = req.cookies.key;
    const users = new Users();
    const [user] = await users.get(username, "username");
    res.status(200).json({
      username: user.username,
    });
  } catch (error) {
    res.sendStatus(status_types.system);
  }
}
