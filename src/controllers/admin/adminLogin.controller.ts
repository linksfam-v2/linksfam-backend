/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, Request} from "express";
import { prisma } from "../../db/db.js";
import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

const adminLoginController =async (req:Request,res:Response) => {
  const { password, email } = req.body;

  const userExists = await prisma.adminUser.findMany({
    where: {
      email: email,
    }
  });
  
  if(userExists.length > 0){
    bcrypt.compare(password, userExists[0].password!, function(err, result) {
      if(result){
        const token = jwt.sign({id: userExists[0]?.id, email: userExists[0]?.email} , 'secret');
        delete  (userExists[0] as any).password;
        res.success( {...userExists[0], token});
      }else{
        res.error('Wrong Credentials!', 400);
      }
  });
  }else{
    res.error('User not registered!', 400);
  }
};

export default adminLoginController;