import { Request, Response } from "express";
import { prisma } from "../../db/db.js";


const authUserController  = async (req:Request, res:Response) => {
  const userId = Number(req?.userId);
  
  try{
    const user = await prisma.user.findMany({
      where: {
      id:userId
      }
    });

    res.success(user);
  }catch(err:unknown){
    console.log(err);
    res.error('Something went wrong!', 400, err);
  }

};

export default authUserController;