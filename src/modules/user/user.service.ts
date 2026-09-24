import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, profilePhoto } = payload;

  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    throw new Error("user with this email already exists");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      profile: {
        create: {
          profilePhoto,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });

  return user;
};

//get my profile
const getMyProfileFromDB = async(userId : string)=>{
  const user = await prisma.user.findUniqueOrThrow({
    where : {id : userId},
    omit : {
      password : true,
    },
    include : {
      profile:true
    }
  })

  return user;
}

//update my profile
 
const updateMyProfileFromDB = async(userId :string, payload:any)=>{
  const {name,email,profilePhoto,bio} = payload;

  //middleware already check  করে দিয়েছে যে user login কিনা . so নতুন করে আর check করার দরকার নেই 

  const updatedUser =  await prisma.user.update({
    where :{
      id :userId
    },
    data :{
      name,
      email,
      profile:{
        update:{
          profilePhoto,
          bio
        }
      }
    },
    omit:{
      password : true,
    },

    include:{
      profile : true
    }
  })

  return updatedUser;
}

export const userService = {
  registerUserIntoDB,
  getMyProfileFromDB,
  updateMyProfileFromDB
};
