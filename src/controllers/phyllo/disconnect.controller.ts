import { Request, Response } from 'express';
import axios from 'axios';
import { PASSWORD, PHYLLO_BASEURL, USERNAME } from './utils.js';


const disconnectController = async (req: Request, res: Response) => {
  
  const id = req.body.id;
  try{
    const accounts = await axios({
      method: 'POST',
      url: `${PHYLLO_BASEURL}/accounts/${id}/disconnect`,
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
   
    res.success({accounts: accounts?.data});
    
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
}

export default disconnectController;
