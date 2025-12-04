import { Router } from "express";
import data from "./data";

const usersRouter = Router();

usersRouter.get("/data", data);


export default usersRouter;
