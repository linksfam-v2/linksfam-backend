import { Request, Response } from "express";
import { prisma } from "../../db/db.js";
import { sendEmailOTP, SendOTP } from "../../utility/otp.js";

const OTPSentCobntroller  = async (req:Request, res:Response) => {
  const { authData } = req.body;
  
  try{
    const userExists = await prisma.user.findMany({
      where: {
        OR: [
          {
            email: authData,
          },
          {
            phone: authData,
          }
        ]
      }
    });
  
    if(userExists.length){
      const oldUser = userExists[0];
      if(oldUser?.type === "COMPANY"){
        await sendEmailOTP(oldUser.email!, 'OTP for Linksfam account!', oldUser?.otp);
      }else{
        await SendOTP(oldUser.phone!.toString(), oldUser?.otp);
      }

      res.success({user:oldUser});

    }else{
      res.error('Something went wrong!', 400);
    }
  }catch(err:unknown){
    console.log(err);
    res.error('Something went wrong!', 400, err);
  }

};

export default OTPSentCobntroller;