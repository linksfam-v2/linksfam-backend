import { Response, Request} from "express";
import { prisma } from "../../db/db.js";

const getAdminCategoryController = async (req:Request,res:Response) => {
  try{
    const categories = await prisma.category.findMany();
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const postCategoryController = async (req:Request, res:Response) => {

  const {name} = req.body;
  try{
    const categories = await prisma.category.create({data:{name}});
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const putCategoryController = async (req:Request, res:Response) => {
  const {id} = req.params;
  const {name} = req.body;
  try{
    const categories = await prisma.category.update({
      where: {id: +id},
      data: {name}
    });
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const deleteController = async (req:Request, res:Response) => {
  const {id} = req.params;
  try{
    const categories = await prisma.category.delete({
      where: {id: +id},
    });
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

export {
  getAdminCategoryController,
  putCategoryController,
  postCategoryController,
  deleteController
}