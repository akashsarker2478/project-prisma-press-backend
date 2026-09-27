import { Router } from "express";
import { commentController } from "./comment.controller";
import { role as Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";

const router = Router()

router.post( 
    "/",
    auth(Role.USER, Role.ADMIN, Role.AUTHOR),
    commentController.createComment
);

router.get(
    "/author/:authorId",
    commentController.getCommentByAuthorId
);

router.get(
    "/:commentId",
    commentController.getCommentByCommentId
);

router.patch(
    "/:commentId",
    auth(Role.USER, Role.ADMIN, Role.AUTHOR),
    commentController.updateComment
);

router.delete(
    "/:commentId",
    auth(Role.USER, Role.ADMIN, Role.AUTHOR),
    commentController.deleteComment
);

router.put(
    "/:commentId/moderate",
    auth(Role.ADMIN),
    commentController.moderateComment
);


export const commentRouter = router;