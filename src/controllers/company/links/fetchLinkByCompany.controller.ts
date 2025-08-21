
import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const fetchLinkByCompanyIdController  = async (req:Request, res:Response) => {
  
  const { companyId } = req.params;

  try{
    const links = await prisma.link.findMany({
      where: {
        companyId: +companyId
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.success(links?.length ?  links : []);
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default fetchLinkByCompanyIdController;