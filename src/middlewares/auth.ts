import { NextFunction, Request, Response } from "express";
import { role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export const auth = (...requiredRoles : role[])=>{
  return catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

    const token = req.cookies.accessToken? req.cookies.accessToken
     : 
     req.headers.authorization?.startsWith("Bearer") ?
      req.headers.authorization?.split(" ")[1] 
     : req.headers.authorization;

    if(!token){
      throw new Error("you are not logged in. please login to access this resource");
    }
  
        const verifiedToken = jwtUtils.verifyToken(
      token,
      config.jwt_access_secret,
    );

    if(!verifiedToken.success){
      throw new Error(verifiedToken.error)
    }
    
   const { id, name, email, role } = verifiedToken.data as JwtPayload;

   if (requiredRoles.length && !requiredRoles.includes(role)){
    throw new Error("forbidden.you don't have permission to access this resource.")
   }

   const user = await prisma.user.findUnique({
    where : {
      id,
      email,
      name,
      role
    }
   })

   if(!user){
    throw new Error("user not found. please log in again");
   }

   if(user.activeStatus === "INACTIVE"){
     throw new Error("your account is inactive. please contact support")
   };

   req.user = {
      email,
      name,
      id,
      role,
    };

    next()

  });
};