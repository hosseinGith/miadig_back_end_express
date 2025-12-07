import authRouter from "./auth";
import { Application } from "express";
import protectedRouter from "./protected";
import { authenticateToken } from "../utils/middlewares";
import path from "path";
import { dirname } from "..";
export default function routes(app: Application) {
  // get home page content
  app.get("/", (req, res) => {
    res.sendFile(path.join(dirname, "public", "index.html"));
  });
  app.use("/auth", authRouter);
  app.use("/other", authenticateToken, protectedRouter);
}
