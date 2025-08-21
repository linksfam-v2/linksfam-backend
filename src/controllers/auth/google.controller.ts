import { Request, Response } from "express";
import { prisma } from "../../db/db.js";
import { generateOTP } from "../../utility/otp.js";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
const GoogleController  = async (req:Request, res:Response) => {
  const { email, type, share, name } = req.body;
  const newOtp = generateOTP().toString();

  try{
    const userExists = await prisma.user.findMany({
      where: {
        email,
      }
    });
  
    if(userExists.length){
      //Continue User
      const user = userExists[0];
      if(user.type !== type){
        res.error(`This email has logged in as ${type === "COMPANY" ? 'Creator': 'Brand'}, please use different email id!`);
      }else{
        const token = jwt.sign({
          data: {
            userId: +user.id,
            email: user?.email,
            phone: user?.phone,
          }
        }, 'secret');
        res.success({...user, token});
  
      }
      
    }else{
      // ! Create User
      const user = await prisma.user.create({
        data: {
          email,
          otp:newOtp,
          type: type,
          isActive: true,
          referredBy: share,
          referralCode: uuidv4().slice(0, 8)?.toUpperCase(),
          ...(type === 'INFLUENCER' && {
            influencer: {
              create: {
                name: name || "",
                email: email || "",
                categoryId: 1 // Use default category ID
              }
            }
          })
        }
      });

      if(share){
        await prisma.referralBonus.create({
          data: {
            userId: +user.id!,
            reward:0,
          }
        })
      }
      
      const token = jwt.sign({
        data: {
          userId: +user.id,
          email: user?.email,
          phone: user?.phone,
        }
      }, 'secret');
      res.success({...user, token});
    }

  }catch(err:unknown){
    console.log(err);
    res.error('Something went wrong!', 400, err);
  }

};

export default GoogleController;