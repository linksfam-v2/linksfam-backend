import { Request, Response } from "express";
import { prisma } from "../../db/db.js";
import { generateOTP, sendEmailOTP } from "../../utility/otp.js";
import { v4 as uuidv4 } from 'uuid';
 
const emailController  = async (req:Request, res:Response) => {
  const {email, type} = req.body;

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   let user:any;

  try{
    const userExists = await prisma.user.findMany({
      where: {
        email: email
      }
    });
  
    if(userExists.length){
      const newOtp = generateOTP().toString();
      
      const oldUser = userExists[0];

      if(oldUser.type !== type){
        res.error(`This email is logged in as ${type === "COMPANY" ? 'Creator': 'Brand'}, please use different email id!`);
      }else{

        await sendEmailOTP(email, 'OTP for Linksfam account', newOtp);
        user = await prisma.user.update({
          where:{
            id: +oldUser.id,
          },
          data: {
            otp: newOtp,
          }
        })
        delete user.otp;
        res.success(user);
      }

    }else{
      const no = generateOTP().toString();
      
      await sendEmailOTP(email, 'OTP for Linksfam account', no);
      
      user = await prisma.user.create({
        data: {
          email: email,
          otp: no,
          isActive: false,
          type,
          referralCode: uuidv4().slice(0, 8)?.toUpperCase()
        }
      });
      
      delete user.otp;

      res.success(user);
    }
  }catch(err:unknown){
    res.error('Something went wrong', 400, err);
  }

};

export default emailController;