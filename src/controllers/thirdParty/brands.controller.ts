import { Request, Response } from "express";
import { prisma } from "../../db/db.js";

const brandsController = async (req: Request, res: Response) => {

  try{
    const brands = await prisma.brands.findMany({});
    res.success(brands);
    
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
}

export default brandsController;
