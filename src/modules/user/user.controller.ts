import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";


type TMeta = {
  page:number;
  limit:number;
  total:number;
}

type TResponseData <T> = {
  success :boolean;
  statusCode: number;
  message:string;
  data:T;
  meta ?:TMeta
}

const sendResponse = <T>(res:Response,data:TResponseData<T>)=>{
  res.status(data.statusCode).json({
    success:data.success,
    statusCode : data.statusCode,
    message:data.message,
    data:data.data,
    meta:data.meta
  })
}

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUserIntoDB(payload);

    sendResponse(res,{
      success:true,
      statusCode:httpStatus.CREATED,
      message:"user created successfully",
      data:{user}
    })

  
  },
);

export const userController = {
  registerUser,
};
