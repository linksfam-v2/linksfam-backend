import { Response, Request} from "express";
import { prisma } from "../../db/db.js";

const getAdminPaymentstrategyController = async (req:Request,res:Response) => {
  try{
    const categories = await prisma.paymentStrategy.findMany();
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const postPaymentstrategyController = async (req:Request, res:Response) => {

  const {strategy_name} = req.body;
  try{
    const categories = await prisma.paymentStrategy.create({data:{strategy_name}});
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const putPaymentstrategyController = async (req:Request, res:Response) => {
  const {id} = req.params;
  const {strategy_name} = req.body;
  try{
    const categories = await prisma.paymentStrategy.update({
      where: {id: +id},
      data: {strategy_name}
    });
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

const deletePaymentstrategyController = async (req:Request, res:Response) => {
  const {id} = req.params;
  try{
    const categories = await prisma.paymentStrategy.delete({
      where: {id: +id},
    });
    res.success(categories);
  }catch(err){
    res.error('Something went wrong!', 400, err);
  }
};

export {
  getAdminPaymentstrategyController,
  postPaymentstrategyController,
  putPaymentstrategyController,
  deletePaymentstrategyController
}