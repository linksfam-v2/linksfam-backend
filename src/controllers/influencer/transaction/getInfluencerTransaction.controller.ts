import { Request, Response } from 'express';
import { prisma } from '../../../db/db.js';


const getInfluencerTransaction = async (req: Request, res: Response) => {
  const { influencerId } = req.params;

  try{
  
    const transaction = await prisma.influencerInvoice.findMany({
    where: {
      influencerId: +influencerId
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      influencer: true,
    }
  });

  const ledger = await prisma.influencerLedger.findMany({
    where: {
      influencerId: +influencerId
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      influencer: true,
    }
  });

  const combinedResults = [...transaction, ...ledger].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );


    res.success({transaction: combinedResults});

  }catch(err:unknown){
    res.error('Something went wrong!', 400, err);
  }
};

export default getInfluencerTransaction;
