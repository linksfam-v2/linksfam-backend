import { Request, Response } from 'express';

const healthController = async (req: Request, res: Response) => {
  
  res.success({ 'Success': 'Ok' });
};

export default healthController;