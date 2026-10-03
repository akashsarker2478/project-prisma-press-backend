import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { commentService } from "./comment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"
const createComment = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const id = req.user?.id;
    const payload = req.body;
    const result = await commentService.createComment(id as string,payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "comment created successfully",
      data: result,
    });
})
const getCommentByAuthorId = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const {authorId} = req.params
    const result = await commentService.getCommentByAuthorId(authorId as string)

      sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "comment retrieved successfully",
      data: result,
    });
})
const getCommentByCommentId = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const {postId} = req.params;
    const result = await commentService.getCommentByCommentId(postId as string);
       sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "comment retrieved successfully",
      data: result,
    });
})
const updateComment = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const{ commentId} = req.params;
    const authorId = req.user?.id;
    const payload = req.body;
    const result = await commentService.updateComment(commentId as string,payload,authorId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK, // 200
        success: true,
        message: "Comment updated successfully",
        data: result,
    });
})
const deleteComment = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const {commentId} = req.params;
    const authorId = req.user?.id;
    await commentService.deleteComment(commentId as string,authorId as string)

    sendResponse(res, {
        statusCode: httpStatus.OK, // 200
        success: true,
        message: "Comment deleted successfully",
        data:null
    });
})
const moderateComment = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const { commentId } = req.params;
    const payload = req.body; // e.g., { status: "APPROVED" }

    const result = await commentService.moderateComment(
        commentId as string,
        payload
    );

    sendResponse(res, {
        statusCode: httpStatus.OK, // 200
        success: true,
        message: "Comment status moderated successfully",
        data: result,
    });
})



export const commentController = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}