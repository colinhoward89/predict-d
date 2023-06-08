import { Router } from "express";
import * as userCont from "./controllers/user.controller";

import { Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

router.post("/register", userCont.createUser);
router.post("/login", userCont.login);
router.post("/logout", userCont.logout);
router.get("/get-all-users", userCont.getAllUsers);
router.get("/getuser/:email", userCont.getUser);
router.delete("/users/:id", userCont.deleteUser);
router.put("/user/:id", userCont.editUser);

export default router;