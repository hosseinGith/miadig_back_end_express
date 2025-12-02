import home from "./pages/home";
import { authenticateToken } from "../utils";
import authRouter from "./auth";
import { Application } from "express";
import { Product } from "../components/product";
export default function routes(app: Application) {
  // get home page content
  app.use("/auth", authRouter);
  app.get("/", authenticateToken, home);
}
const product = new Product();
