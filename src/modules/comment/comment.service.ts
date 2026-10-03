import { commentStatus } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { ICreateCommentPayload, IModerateCommentPayload, IUpdateCommentPayload } from "./comment.interface"

const createComment = async(authorId:string,payload:ICreateCommentPayload) => {
    await prisma.post.findFirstOrThrow({
        where:{
            id:payload.postId
        }
    })

    const comment = await prisma.comment.create({
        data:{
            ...payload,
            authorId
        }
    })

    return comment
}

const getCommentByAuthorId = async(authorId:string) => {
    const comments = await prisma.comment.findMany({
        where:{
            authorId
        },
        orderBy:{
            createdAt:"desc"
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true
                }
            }
        }
    })

    return comments;
}

const getCommentByCommentId = async(postId:string) => {
    const comments = await prisma.comment.findMany({
        where :{
            postId
        },
      
    })

    return comments;
}

const updateComment = async(commentId:string,data:IUpdateCommentPayload,authorId:string) => {
    const commentData = await prisma.comment.findFirstOrThrow({
        where:{
            id:commentId,
            authorId
        },
        select:{
            id:true
        }
    })

    const comment = await prisma.comment.update({
        where:{
            id:commentData.id,
            authorId
        },
        data
    })

    return comment;
}

const deleteComment = async(commentId:string,authorId:string) => {
    const commentData =  await prisma.comment.findFirstOrThrow({
        where:{
            id:commentId,
            authorId
        },
        select:{
            id:true
        }
    })
       const comment = await prisma.comment.delete({
            where:{
                id:commentData.id
            }
        })
        return comment;
}

const moderateComment =async(commentId:string,data:IModerateCommentPayload) => {
    await prisma.comment.findUniqueOrThrow({
        where:{
            id:commentId
        },
        select:{
            id:true
        }
    });

    const comment = await prisma.comment.update({
        where:{
            id:commentId,
        },
        data
    })

    return comment;
}

export const commentService = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}