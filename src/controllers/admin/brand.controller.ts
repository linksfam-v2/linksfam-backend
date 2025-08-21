import { Response, Request } from "express";
import { prisma } from "../../db/db.js";

const getBrandsController = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.brands.findMany();
    res.success(brands);
  } catch (err) {
    res.error("Something went wrong!", 400, err);
  }
};

const postBrandController = async (req: Request, res: Response) => {
  const {
    brand_name,
    brand_email,
    brand_url,
    person_name,
    person_email,
    person_phone,
    emp_count,
    max_spend,
    min_spend,
    campaignId,
    image_url,
  } = req.body;

  try {
    const brand = await prisma.brands.create({
      data: {
        brand_name,
        brand_email,
        brand_url,
        person_name,
        person_email,
        person_phone,
        emp_count,
        max_spend,
        min_spend,
        campaignId,
        image_url,
      },
    });
    res.success(brand);
  } catch (err) {
    res.error("Something went wrong!", 400, err);
  }
};

const putBrandController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    brand_name,
    brand_email,
    brand_url,
    person_name,
    person_email,
    person_phone,
    emp_count,
    max_spend,
    min_spend,
    campaignId,
    image_url
  } = req.body;

  try {
    const brand = await prisma.brands.update({
      where: { id: +id },
      data: {
        brand_name,
        brand_email,
        brand_url,
        person_name,
        person_email,
        person_phone,
        emp_count,
        max_spend,
        min_spend,
        campaignId,
        image_url
      },
    });
    res.success(brand);
  } catch (err) {
    res.error("Something went wrong!", 400, err);
  }
};

const deleteBrandController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const brand = await prisma.brands.delete({
      where: { id: +id },
    });
    res.success(brand);
  } catch (err) {
    res.error("Something went wrong!", 400, err);
  }
};

export {
  getBrandsController,
  postBrandController,
  putBrandController,
  deleteBrandController,
};
