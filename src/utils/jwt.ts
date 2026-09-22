import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (payload : JwtPayload , secret :string , expiresIn : SignOptions["expiresIn"])=>{
    const token = jwt.sign(payload,secret,{expiresIn});

    return token;
}

const verifyToken = (token : string, secret: string)=>{
   try {
     const verifiedToken = jwt.verify(token,secret)
    return verifiedToken;
   } catch (error) {
    console.log("token verification failed",error)
    throw new Error ("invalid token")
   }
}

export const jwtUtils = {
    createToken,
    verifyToken
}