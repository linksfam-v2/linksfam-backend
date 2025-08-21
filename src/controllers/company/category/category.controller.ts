import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

const getCategoryController = async (req: Request, res: Response) => {
  try{
    const category = await prisma.category.findMany(
      {
        orderBy: {
          name: 'asc'
        }
      }
    );
    res.success(category);
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default getCategoryController;
