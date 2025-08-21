import { Request, Response } from "express";
import { triggerEmail } from "../../../utility/otp.js";

const parterBulkController  = async (req:Request, res:Response) => {
  
  const { name, qty, pName, phone } = req.body;
  try{
    await triggerEmail(name, phone, qty, pName);
    res.success({success:'oK'});
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default parterBulkController;