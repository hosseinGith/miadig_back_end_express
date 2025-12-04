import { Router } from "express";
import usersRouter from "./users/index";
import pagesRouter from "./pages";
const protectedRouter = Router();

protectedRouter.use("/users", usersRouter);

protectedRouter.use("/pages", pagesRouter);

export default protectedRouter;
