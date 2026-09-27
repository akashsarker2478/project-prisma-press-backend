import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;
    const result = await postService.createPost(payload, id as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Post created successfully",
      data: result,
    });
  },
);

const getAllPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getAllPosts();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "post retrieved successfully",
      data: result,
    });
  },
);

const getPostById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    if (!postId) {
      throw new Error("post id required in params");
    }

    const result = await postService.getPostById(postId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "post retrieved successfully",
      data: result,
    });
  },
);

const updatePosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const deletePosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getPostsStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

const getMyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const result = await postService.getMyPosts(authorId as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "my post retrieved successfully",
      data: result,
    });
  },
);

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  updatePosts,
  deletePosts,
  getPostsStats,
  getMyPosts,
};
