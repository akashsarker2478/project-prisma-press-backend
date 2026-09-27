import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { role as Role } from "../../../generated/prisma/enums";
import { postController } from "./post.controller";

const router = Router();

router.post("/",auth(Role.USER,Role.ADMIN,Role.AUTHOR),postController.createPost)

router.get("/",postController.getAllPost)

router.get("/stats",auth(Role.ADMIN),postController.getPostsStats)

router.get("/my-posts",auth(Role.USER,Role.ADMIN),postController.getMyPosts)

router.get("/:postId",postController.getPostById)

router.patch("/:postId",auth(Role.USER,Role.ADMIN),postController.updatePosts)

router.delete("/:postId",auth(Role.USER,Role.ADMIN),postController.deletePosts)


export const postRouter = router;