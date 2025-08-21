import { prisma } from "../../db/db.js";
import { Response, Request} from "express";
export const getAdminRequestRefundController = async (req:Request,res:Response) => {
  try{
    const trans = await prisma.requestRefund.findMany(
      {
        where: {
          isCompleted: false,
        },
        include: {
          company: true,
        }
      }
    );
    res.success(trans);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

export const postAdminRequestRefundController = async (req:Request,res:Response) => {

  const {id} = req.body;

  try{
    const trans = await prisma.requestRefund.update(
      {
        where: {
          id: +id
      },
      data:{
        isCompleted: true,
      }
    }
    );
    res.success(trans);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};