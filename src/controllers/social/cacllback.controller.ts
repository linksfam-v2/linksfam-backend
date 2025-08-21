import { Request, Response } from 'express';
 
const callbackController = (_req: Request, res: Response): void => {
  res.redirect(301, "https://www.linksfam.com/creator/socials/");
};

export default callbackController;
