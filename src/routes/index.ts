import home from "./home";
import { authenticateToken } from "../utils";
import authRouter from "./auth";
import { Application } from "express";
export default function routes(app: Application) {
  // get home page content
  app.use("/auth", authRouter);
  app.get("/", authenticateToken, home);
}
