import { Router } from "express";

import login from "./login";
import code from "./code";

const router = Router();

router.post("/login", login);

router.post("/login/code", code);

export default router;
