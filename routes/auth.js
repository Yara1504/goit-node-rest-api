import express from "express";
import validateBody from "../middlewares/validateBody.js";
import {authenticate} from "../middlewares/authenticate.js"
import { schema } from "../models/users.js";
import {
    register,
    login, 
    getCurrent,
    logout,
    updateAvatar
} from "../controllers/auth.js";
import {upload} from "../middlewares/upload.js"

const authRouter = express.Router();

authRouter.post("/register", validateBody(schema.registerSchema), register);
authRouter.post("/login", validateBody(schema.loginSchema), login);
authRouter.get("/current", authenticate, getCurrent);
authRouter.post("/logout", authenticate, logout);
authRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

export default authRouter;
