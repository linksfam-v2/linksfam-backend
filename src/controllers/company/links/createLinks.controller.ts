
import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const createLinksController  = async (req:Request, res:Response) => {
  
  const {link, category_id, fee, company_id, type } = req.body;

  let links;
  
  try{
    const linksExists = await prisma.link.findMany({
      where:{
        link,
        categoryId: +category_id,
        companyId: +company_id,
        type,
      }
    });

    if(linksExists?.length > 0){
      res.error("Link and Category combination already exists!");
    }else{
      links = await prisma.link.create({
        data:{
           link,
           companyId: +company_id,
           categoryId: +category_id,
           fee,
           type
        }
      });
      res.success(links);
    }
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default createLinksController;