import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const companyCreateController  = async (req:Request, res:Response) => {
  
  const {
    name, 
    url,    
    areaOfSpecialty,
    country,
    fb,
    git,
    gst,
    instagram,
    latlng,
    linkedin,
    nameOfPerson,
    phoneOfPerson,
    pin,
    snap,
    tiktok,
    twitch,
    desgOfPerson,
    x,
    yt,
    stepTwo
  } = req.body;

  const userId = Number(req?.userId);

  let company;

  try{
    const companyExists = await prisma.company.findMany({
      where: {
        userId: +userId,
      }
    });
    
    if(companyExists?.length){
      const oldCompany = companyExists[0];

      company = await prisma.company.update({
        where: {
          id: +oldCompany.id,
        },
        data: {
          name,
          url,
          areaOfSpecialty,
          country,
          fb,
          git,
          gst,
          instagram,
          latlng,
          linkedin,
          nameOfPerson,
          phoneOfPerson,
          pin,
          snap,
          tiktok,
          twitch,
          desgOfPerson,
          x,
          yt,
          stepTwo
        }
      });
      res.success(company, "Company updated successfully");
    }else{
      company = await prisma.company.create({
        data: {
          name,
          url,
          userId: +userId,
          areaOfSpecialty,
          country,
          fb,
          git,
          gst,
          instagram,
          latlng,
          linkedin,
          nameOfPerson,
          phoneOfPerson,
          pin,
          snap,
          tiktok,
          twitch,
          desgOfPerson,
          x,
          yt,
        }
      });
      res.success(company);
    }
    
  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }

};

export default companyCreateController;