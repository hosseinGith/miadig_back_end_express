import { Request, Response } from "express-serve-static-core";
import path from "path";
import { dirname } from "..";

function home(req: Request, res: Response) {
  const filePath = path.join(dirname, "public/index.html");
  res.sendFile(filePath);
}

export default home;
