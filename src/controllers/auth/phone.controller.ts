import { Request, Response } from "express";
import { prisma } from "../../db/db.js";
import { generateOTP, SendOTP } from "../../utility/otp.js";
import { v4 as uuidv4 } from 'uuid';
const phoneController  = async (req:Request, res:Response) => {
  const {phone, type} = req.body;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user:any;

  try{
    const userExists = await prisma.user.findMany({
      where: {
        phone: phone
      }
    });
  
    if(userExists.length){
      const newOtp = generateOTP().toString();
      
      const oldUser = userExists[0];

      if(oldUser.type !== type){
        res.error(`This email has logged in as ${type === "COMPANY" ? 'Creator': 'Brand'}, please use different email id!`);
      }else{
        await SendOTP(phone, newOtp);
  
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
      const ot = generateOTP().toString(); 
      await SendOTP(phone, ot);
      user = await prisma.user.create({
        data: {
          phone: phone,
          otp: ot,
          isActive: false,
          type,
          referralCode: uuidv4().slice(0, 8)?.toUpperCase(),
          ...(type === 'INFLUENCER' && {
            influencer: {
              create: {
                name: "",
                whatsapp: phone || "",
                categoryId: 1 // Use default category ID
              }
            }
          })
        }
      });

      delete user.otp;
      
      res.success(user);
    }

    // ! Send OTP as email/Phone API
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }

};

export default phoneController;