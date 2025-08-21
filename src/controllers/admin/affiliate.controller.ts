import { Response, Request } from "express";
import { prisma } from "../../db/db.js";

const getAdminadvertistmentController = async (req: Request, res: Response) => {
  try {
    const advertistment = await prisma.advertistment.findMany();
    res.success(advertistment);
  } catch (err) {
    res.error("Something went wrong!", 400, err);
  }
};

const postadvertistmentController = async (req: Request, res: Response) => {
  const {
    source,
    brand,
    category,
    keyword,
    url,
    email_creds,
    username_creds,
    password_creds,
    affiliate_page_link,
    payment_strategy,
    product_link,
    note,
    status,
    fee
  } = req.body;

  try {
    const newCategory = await prisma.advertistment.create({
      data: {
        source,
        brand,
        category,
        keyword,
        url,
        email_creds,
        username_creds,
        password_creds,
        affiliate_page_link,
        payment_strategy,
        product_link,
        note,
        status,
        fee,
      },
    });
    res.success(newCategory);
  } catch (err) {
    res.error("Something went wrong!", 400, err);
  }
};

const putadvertistmentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    source,
    brand,
    category,
    keyword,
    url,
    email_creds,
    username_creds,
    password_creds,
    affiliate_page_link,
    payment_strategy,
    product_link,
    note,
    status,
    fee,
  } = req.body;

  try {
    const updatedCategory = await prisma.advertistment.update({
      where: { id: +id },
      data: {
        source,
        brand,
        category,
        keyword,
        url,
        email_creds,
        username_creds,
        password_creds,
        affiliate_page_link,
        payment_strategy,
        product_link,
        note,
        status,
        fee
      },
    });
    res.success(updatedCategory);
  } catch (err) {
    res.error("Something went wrong!", 400, err);
  }
};

const deleteadvertistmentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedCategory = await prisma.advertistment.delete({
      where: { id: +id },
    });
    res.success(deletedCategory);
  } catch (err) {
    res.error("Something went wrong!", 400, err);
  }
};

export {
  getAdminadvertistmentController,
  postadvertistmentController,
  putadvertistmentController,
  deleteadvertistmentController,
};
