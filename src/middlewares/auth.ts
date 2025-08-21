import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

const authenticatedUser = (req:Request, res:Response, next: NextFunction) => {
  try{
  
    const token:string|undefined= req?.headers?.authorization?.split(' ')[1];

    const decodedToken:string | jwt.JwtPayload = jwt.verify(token?.trim() || '', 'secret');

    if(typeof decodedToken !== 'string' && decodedToken?.data?.userId){
      req['userId'] = decodedToken?.data?.userId;
    }
    next();

  }catch(err:unknown){
    res.error('Can not authenticate user', 400, err);
  }
};

export {authenticatedUser};