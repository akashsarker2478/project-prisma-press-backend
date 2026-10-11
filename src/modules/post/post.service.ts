import { commentStatus, postStatus } from "../../../generated/prisma/enums";
import { postWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  IUpdatedPostPayload,
} from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};

const getAllPosts = async (query: IPostQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andConditions : postWhereInput[] = [];
  //searchTerm
  if(query.searchTerm){
    andConditions.push({
      OR:[
        {title:{contains:query.searchTerm, mode: "insensitive"}},
        {content:{contains:query.searchTerm, mode: "insensitive"}}
      ]
    });
  };


//title filter
if(query.title){
  andConditions.push({
   title : query.title
  })
};

if(query.content){
  andConditions.push({
    content : query.content
  })
};

if(query.authorId){
  andConditions.push({
    authorId : query.authorId
  })
};

if(query.isFeatured){
  andConditions.push({
    isFeatured : Boolean(query.isFeatured)
  })
};

if(query.tags){
const tagsString = query.tags as string;
const tagsArray = typeof tagsString === "string"?  tagsString.split(",") 
    : (query.tags as string[]);
  andConditions.push({
    tags :{
      hasSome : tagsArray
    }
  })
};

if(query.status){
  andConditions.push({
    status : query.status
  })
}

  const posts = await prisma.post.findMany({
    // //dynamic searching,filtering
    // where: {
    //   AND: [
    //     query.searchTerm
    //       ? {
    //           OR: [
    //             {
    //               title: {
    //                 contains: query.searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //             {
    //               content: {
    //                 contains: query.searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //           ],
    //         }
    //       : {},

    //     //title filtering
    //     // {
    //     //   title:query.title
    //     // }
    //     query.title ? { title: query.title } : {},

    //     //content filtering
    //     query.content ? { content: query.content } : {},
    //   ],
    // },

     where :{
      AND :andConditions
    },
    //pagination (variable call upper)
    take: limit,
    skip: skip,

    //sort(variable call upper)
    orderBy: {
      [sortBy]: sortOrder,
    },

   

    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return posts;
};

const getPostById = async (postId: string) => {
  // await prisma.post.update({
  //   where: {
  //     id: postId,
  //   },
  //   data: {
  //     views: {
  //       increment: 1,
  //     },
  //   },

  // });

  // const post = await prisma.post.findUniqueOrThrow({
  //   where :{
  //     id :postId
  //   },
  //   include :{
  //     author:{
  //       omit:{
  //         password :true
  //       },

  //     },
  //     comments:{
  //       where :{
  //         status :commentStatus.APPROVED
  //       },
  //       orderBy :{
  //         createdAt:"desc"
  //       }
  //     },
  //     _count:{
  //       select:{
  //         comments:true
  //       }
  //     }
  //   }
  // })
  // return post;

  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: commentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });
  return transactionResult;
};

const updatePost = async (
  postId: string,
  payload: IUpdatedPostPayload,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findFirstOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("you are not the owner of this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });

  return result;
};

const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findFirstOrThrow({
    where: {
      id: postId,
    },
  });
  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("you are not the owner of this post");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const getPostsStats = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPosts = await tx.post.count();

    // const totalPublishedPost = await tx.post.count({
    //   where:{
    //     status:postStatus.PUBLISHED
    //   }
    // })
    // const totalDraftPost = await tx.post.count({
    //   where:{
    //     status:postStatus.DRAFT
    //   }
    // })
    // const totalArchivedPost = await tx.post.count({
    //   where:{
    //     status:postStatus.ARCHIVED
    //   }
    // })

    // const totalComments = await tx.comment.count();
    // const totalApprovedComments = await tx.comment.count({
    //   where:{
    //     status :commentStatus.APPROVED
    //   }
    // })
    // const totalRejectedComments = await tx.comment.count({
    //   where:{
    //     status :commentStatus.REJECT
    //   }
    // });

    // const totalPostViewsAggregate =  await tx.post.aggregate({
    //   _sum:{
    //     views:true
    //   }
    // })

    // const totalPostViews = totalPostViewsAggregate._sum.views

    // return {
    //   totalPosts,
    //   totalPublishedPost,
    //   totalDraftPost,
    //   totalArchivedPost,
    //   totalComments,
    //   totalApprovedComments,
    //   totalRejectedComments,
    //   totalPostViews
    // }

    const [
      totalPosts,
      totalPublishedPost,
      totalDraftPost,
      totalArchivedPost,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViewsAggregate,
    ] = await Promise.all([
      tx.post.count(),
      tx.post.count({
        where: {
          status: postStatus.PUBLISHED,
        },
      }),
      tx.post.count({
        where: {
          status: postStatus.DRAFT,
        },
      }),
      tx.post.count({
        where: {
          status: postStatus.ARCHIVED,
        },
      }),
      tx.comment.count(),
      tx.comment.count({
        where: {
          status: commentStatus.APPROVED,
        },
      }),
      tx.comment.count({
        where: {
          status: commentStatus.REJECT,
        },
      }),
      tx.post.aggregate({
        _sum: {
          views: true,
        },
      }),
    ]);

    return {
      totalPosts,
      totalPublishedPost,
      totalDraftPost,
      totalArchivedPost,
      totalComments,
      totalApprovedComments,
      totalRejectedComments,
      totalPostViews: totalPostViewsAggregate._sum.views,
    };
  });
  return transactionResult;
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId,
    },

    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return result;
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsStats,
  getMyPosts,
};
