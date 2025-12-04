import { Router } from "express";
import home from "./home";

const pagesRouter = Router();

pagesRouter.post("/home", home);
pagesRouter.post("/home", home);
export default pagesRouter;
