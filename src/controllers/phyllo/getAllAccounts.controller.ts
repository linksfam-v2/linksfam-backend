import { Request, Response } from 'express';
import { prisma } from '../../db/db.js';
import axios from 'axios';
import { PASSWORD, PHYLLO_BASEURL, USERNAME } from './utils.js';


const getAllAccountsController = async (req: Request, res: Response) => {
  
  const userId = Number(req?.userId); const acc = []; const platforms = [];

  try{
    const phylloId = await prisma.userPhyllo.findMany({
      where: {
        userId: +userId,
      }
    });

    const accounts = await axios({
      method: 'GET',
      url: `${PHYLLO_BASEURL}/accounts?user_id=${phylloId[0]?.phyllo_id}`,
      auth: {
        username: USERNAME,
        password: PASSWORD
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Basic 123'
      },
    })

    for(const it of accounts.data.data){
      acc.push({
        id: it?.id,
        platform_id: it?.work_platform?.id,
        username: it?.username,
        user: it?.user,
        status: it?.user,
      })
    }
    for(const it of accounts.data.data){
      if(it.status == "CONNECTED"){
        platforms.push(it?.work_platform?.id);
      }
    }
    res.success({accounts: acc, platforms});
    
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
}

export default getAllAccountsController;
