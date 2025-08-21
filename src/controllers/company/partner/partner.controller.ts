
import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const partnerController  = async (req:Request, res:Response) => {
  
  const { id } = req.params;

  try{
    const partner = await prisma.partnerBrand.findMany({
      where: {
        slug: id
      },
    });
    res.success(partner);
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default partnerController;