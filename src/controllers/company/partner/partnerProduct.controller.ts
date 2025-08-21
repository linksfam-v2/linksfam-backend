import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const partnerProductController  = async (req:Request, res:Response) => {
  
  const { id, pid } = req.params;

  try{
    const partner = await prisma.partnerBrand.findMany({
      where: {
        slug: id,
      },
      include: {
        partnerBrandProduct: {
          where:{
            id:+pid,
          }
        }
      }
    });
    res.success(partner);
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default partnerProductController;