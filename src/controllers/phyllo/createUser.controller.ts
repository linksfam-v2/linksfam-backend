
import { Request, Response } from 'express';
import { PASSWORD, PHYLLO_BASEURL, USERNAME } from './utils.js';
import axios from 'axios';
import { prisma } from '../../db/db.js';


const createUserController = async (req: Request, res: Response) => {
  
  const url:string = `${PHYLLO_BASEURL}/users`;

  const tokenUrl:string = `${PHYLLO_BASEURL}/sdk-tokens`;

  const userId = Number(req?.userId);
  console.log(7, userId);
  try{
    const name = await prisma.influencer.findMany({
      where: {
        userId: userId,
      }
    });

    const phyllo = await prisma.userPhyllo.findMany({
      where: {
        userId: +userId
      }
    });

    if(phyllo.length > 0){
      // Create the token   // Id is there
      const phyl = phyllo[0];

      const tokens = await axios({
        method: 'POST',
        url: tokenUrl,
        data:{
          user_id: phyl?.phyllo_id,
          products: [
          "IDENTITY", 
          "ENGAGEMENT"
          ]
        },
        auth: {
          username: USERNAME,
          password: PASSWORD
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Basic 123'
        },
      });
      res.success({sdkToken: tokens?.data?.sdk_token, id:phyl?.phyllo_id,name});

    }else{
      const users = await axios({
        method: 'POST',
        url: url,
        data: {
          name: name[0]?.name,
          external_id: +userId,
        },
        auth: {
          username: USERNAME,
          password: PASSWORD
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Basic 123'
        },
      });
      // Push to the 
      await prisma.userPhyllo.create({
        data: {
          userId: +userId,
          phyllo_id: users?.data.id
        }
      });


      const tokens = await axios({
        method: 'POST',
        url: tokenUrl,
        data:{
          user_id:users?.data?.id,
          products: [
          "IDENTITY", 
          "ENGAGEMENT"
          ]
        },
        auth: {
          username: USERNAME,
          password: PASSWORD
        },
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Basic 123'
        },
      });

      res.success({sdkToken: tokens?.data?.sdk_token, id: users?.data?.id, name});
    }
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
}

export default createUserController;
