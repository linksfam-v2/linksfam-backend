import { Response, Request} from "express";
import { prisma } from "../../db/db.js";

const getAdminSourceController = async (req:Request,res:Response) => {
  try{
    const categories = await prisma.source.findMany();
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const postSourceController = async (req:Request, res:Response) => {

  const {source_name, source_url} = req.body;
  try{
    const categories = await prisma.source.create({data:{source_name, source_url}});
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const putSourceController = async (req:Request, res:Response) => {
  const {id} = req.params;
  const {source_name, source_url} = req.body;
  try{
    const categories = await prisma.source.update({
      where: {id: +id},
      data: {source_name, source_url}
    });
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const deleteSourceController = async (req:Request, res:Response) => {
  const {id} = req.params;
  try{
    const categories = await prisma.source.delete({
      where: {id: +id},
    });
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

export {
  getAdminSourceController,
  postSourceController,
  deleteSourceController,
  putSourceController
}