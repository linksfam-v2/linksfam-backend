import { Response, Request } from "express";
import { prisma } from "../../db/db.js";

const getAffiliateController = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.affiliate.findMany();
    res.success(brands);
  } catch (err) {
    res.error("Something went wrong!", 400, err);
  }
};

const postAffiliateController = async (req: Request, res: Response) => {
  const {
    params,
    influencerParams,
    fixedParams,
    affiliateLink,
    name,
    note,
    type,
  } = req.body;

  try {
    const affiliates = await prisma.affiliate.create({
      data: {
        params,
        influencerParams,
        fixedParams,
        affiliateLink,
        name,
        note,
        type,
      },
    });
    res.success(affiliates);
  } catch (err) {
    res.error("Something went wrong!", 400, err);
  }
};

const putAffiliateController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    params,
    influencerParams,
    fixedParams,
    affiliateLink,
    name,
    note,
    type,
  } = req.body;

  try {
    const affiliate = await prisma.affiliate.update({
      where: { id: +id },
      data: {
      params,
      influencerParams,
      fixedParams,
      affiliateLink,
      name,
      note,
      type,
      },
    });
    res.success(affiliate);
  } catch (err) {
    res.error("Something went wrong!", 400, err);
  }
};

const deleteAffiliateController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const affiliate = await prisma.affiliate.delete({
      where: { id: +id },
    });
    res.success(affiliate);
  } catch (err) {
    res.error("Something went wrong!", 400, err);
  }
};

export {
  getAffiliateController,
  postAffiliateController,
  putAffiliateController,
  deleteAffiliateController,
};
