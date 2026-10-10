import { postStatus } from "../../../generated/prisma/enums";
import { postWhereInput } from "../../../generated/prisma/models";

export interface ICreatePostPayload{
    title:string;
    content:string;
    thumbnail?:string;
    isFeatured ?:boolean;
    status?:postStatus;
    tags:string[]
}

export interface IUpdatedPostPayload{
    title?:string;
    content?:string;
    thumbnail?:string;
    isFeatured ?:boolean;
    status?:postStatus;
    tags?:string[]
}

//post where input take post all fields
export interface IPostQuery extends postWhereInput {
  searchTerm?:string;
  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
}
