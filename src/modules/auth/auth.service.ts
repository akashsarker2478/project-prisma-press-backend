import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

   if(user.activeStatus === "INACTIVE"){
     throw new Error("your account is inactive. please contact support")
   };

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken =jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions["expiresIn"]

  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
  config.jwt_refresh_expires_in as SignOptions["expiresIn"]
);

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async(refreshToken :string)=>{
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken,config.jwt_refresh_secret);

  if(!verifiedRefreshToken.success){
    throw new Error(verifiedRefreshToken.error)
  }

  const {id} = verifiedRefreshToken.data as JwtPayload;
  const user = await prisma.user.findUniqueOrThrow({
    where:{
      id
    }
  })
  if(user.activeStatus === "INACTIVE"){
    throw new Error("user is inactive")
  }

  const jwtPayload = {
    id,
    name:user.name,
    email:user.email,
    role:user.role
  }

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions["expiresIn"]
  )
return {accessToken}
}

export const authService = {
  loginUser,
  refreshToken
};
