import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";


const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "user created successfully",
      data: { user },
    });
  },
);

//user profile
const userProfile = catchAsync(
  async(req:Request,res:Response,next:NextFunction)=>{
    
    const {accessToken} = req.cookies;
    // console.log(req.user,"user request")

    // const verifiedToken = jwtUtils.verifyToken(accessToken,config.jwt_access_secret)
    //   if(typeof verifiedToken === "string"){
    //     throw new Error(verifiedToken)
    //   }
    const profile = await userService.getMyProfileFromDB(req.user?.id as string)

   sendResponse(res,{
    success:true,
    statusCode : httpStatus.OK,
    message :"user profile fetched successfully",
    data:{profile}
   })
  }
)

export const userController = {
  registerUser,
  userProfile
};
