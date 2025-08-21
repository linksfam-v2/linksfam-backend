import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';

const createProfileInfluencerController = async (req: Request, res: Response) => {
  
  const { name, city, whatsapp, email } = req.body; 
  
  const userId = Number(req?.userId);

  let influencer;

  const category = await prisma.category.findMany();

  try{

    const influencerExists = await prisma.influencer.findMany({
      where: {
        userId: +userId,
      }
    });
    if(influencerExists?.length){
      // Influencer already exists
      const oldInfluencer = influencerExists[0];
      
      influencer = await prisma.influencer.update({
        where: {
          id: +oldInfluencer?.id
        },
        data: {
          name:name,
          city:city,
          whatsapp:whatsapp,
          email:email
        }
      })

    }else{
      // New influencer
      const existingTags = await prisma.influencer.findMany({
        where: {
          amazon_tag: {
            startsWith: 'linksfam',
          },
        },
        select: {
          amazon_tag: true,
        },
      });

      // Step 2: Calculate max counter
      const getCounter = (tag: string) => {
        const match = tag.match(/linksfam(\d+)-21/);
        return match ? parseInt(match[1], 10) : 0;
      };

      const maxCounter = existingTags.reduce((max, { amazon_tag }) => {
        const count = getCounter(amazon_tag!);
        return count > max ? count : max;
      }, 0);

      const nextCounter = maxCounter + 1;
      const formattedCounter = nextCounter.toString().padStart(2, '0');
      const newAmazonTag = `linksfam${formattedCounter}-21`;


      influencer = await prisma.influencer.create({
        data: {
          userId: +userId,
          name:name,
          categoryId: +category[0]?.id, 
          city:city,
          amazon_tag: newAmazonTag,
          whatsapp:whatsapp,
          email:email
        }
      });
    }
    res.success(influencer);
    
  }catch(err:unknown){
    console.log(err);
    res.error('Something went wrong!', 400, err);
  }

}

export default createProfileInfluencerController;
