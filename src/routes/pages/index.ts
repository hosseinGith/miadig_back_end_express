import { Router } from "express";
import home from "./home";

const pagesRouter = Router();
export const users = new Map();

pagesRouter.get("/home", home);
pagesRouter.post("/home/verify", (req, res) => {
  const { id, response } = req.body;
  const userId = "user-1";

  const user = users.get(userId);
  if (!user) return res.sendStatus(400);

  // ✅ اینجا باید attestation رو verify کنی (بعداً)
  // فعلاً فقط publicKey ذخیره می‌کنیم

  users.set(userId, {
    ...user,
    credentialId: id,
    publicKey: response.attestationObject,
  });

  res.json({ ok: true });
});
pagesRouter.post("/home", home);
export default pagesRouter;
