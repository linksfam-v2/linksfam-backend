import { Response, Request} from "express";
import { prisma } from "../../db/db.js";

const getAdminLinkController = async (req:Request,res:Response) => {
  try{
    const categories = await prisma.link.findMany({
      orderBy:{
        createdAt: 'desc'
      }
    });
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const postLinkController = async (req:Request, res:Response) => {

  const {link, type, isActive, input_type, fee, categoryId, companyId, brandId, isExploreBrandlink = false} = req.body;
  try{
    const links = await prisma.link.create({
      data: {
       link:link,
       currency: 'INR',
       fee:fee,
       isActive: isActive,
       type: type,
       input_type: input_type,
       categoryId: categoryId,
       companyId: companyId,
       brandId: +brandId,
       isExploreBrandlink,
      }
    });
    res.success(links);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const putLinkController = async (req:Request, res:Response) => {
  const {id} = req.params;
  const {link, type, isActive, input_type, fee, categoryId, companyId,brandId} = req.body;
  try{
    const links = await prisma.link.update({
      where: {id: +id},
      data: { 
        link:link,
        currency: 'INR',
        fee:fee,
        isActive: isActive,
        type: type,
        input_type: input_type,
        categoryId: categoryId,
        companyId: companyId,
        brandId:+brandId
      }
    });
    res.success(links);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const deleteLinkController = async (req:Request, res:Response) => {
  const { id } = req.params;
  try{
    const links = await prisma.link.delete({
      where: {id: +id},
    });
    res.success(links);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

export {
  getAdminLinkController,
  postLinkController,
  putLinkController,
  deleteLinkController
}