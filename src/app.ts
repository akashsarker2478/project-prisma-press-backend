import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { commentRouter } from "./modules/comment/comment.route";
import { postRouter } from "./modules/post/post.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";


const app:Application = express()


//middleware
app.use(cors({
    origin : config.app_url,
    credentials : true,
}))

app.use(express.json());
app.use(express.urlencoded({extended  : true}));
app.use(cookieParser());

app.get("/",(req:Request,res:Response)=>{
    res.send("HELLO WORLD !")
})

//routes
app.use("/api/users",userRouter)
app.use("/api/auth",authRouter)
app.use("/api/comments",commentRouter)
app.use("/api/posts",postRouter)

//not found middleware
app.use(notFound)

//global error handler middleware
app.use(globalErrorHandler)

export default app;