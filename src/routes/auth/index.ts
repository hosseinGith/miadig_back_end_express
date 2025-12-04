import { Router } from "express";

import login from "./login";
import verifyCode from "./verify-code";

const router = Router();

router.post("/login", login);

router.post("/login/code", verifyCode);

export default router;
