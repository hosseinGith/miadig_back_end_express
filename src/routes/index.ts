import authRouter from "./auth";
import { Application } from "express";
import protectedRouter from "./protected";
import { authenticateToken } from "../utils/middlewares";
export default function routes(app: Application) {
  // get home page content
  app.use("/auth", authRouter);
  app.use("/other", authenticateToken, protectedRouter);
}
