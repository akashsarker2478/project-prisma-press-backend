import {  Router } from "express";

import { userController } from "./user.controller";
import { role as Role } from "../../../generated/prisma/enums";

import { auth } from "../../middlewares/auth";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: String;
        name: string;
        id: String;
        role: Role;
      };
    }
  }
}

router.post("/register", userController.registerUser);



router.get(
  "/me",
 auth(Role.ADMIN,Role.USER,Role.AUTHOR),
  userController.userProfile,
);

export const userRouter = router;
