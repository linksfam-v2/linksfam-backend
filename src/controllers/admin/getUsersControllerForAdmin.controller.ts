import { Response, Request} from "express";
import { prisma } from "../../db/db.js";

export const getUsersControllerForAdmin = async (req:Request,res:Response) => {
  const filter = (req.query.filter as 'ADMIN' | 'INFLUENCER' | 'COMPANY') || 'INFLUENCER';

  try{
    const users = await prisma.user.findMany({
      where: {
        type: filter,
      },
      orderBy: {
        id: 'asc'
      },
      include: {
        company: filter === "COMPANY" ? true : false,
        influencer: filter === "INFLUENCER" ?  true : false,
      }
    });
    res.success(users);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};
