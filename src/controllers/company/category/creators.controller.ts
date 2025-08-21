import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const getCreatorsController = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Fetch paginated creators
    const creators = await prisma.creators.findMany({
      skip,
      take: limit,
      orderBy: { id: "asc" }, // Sorting by most recent first
    });

    // Count total creators
    const totalCount = await prisma.creators.count();

    res.success({
      data: creators,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        perPage: limit,
      },
    });
  } catch (err: unknown) {
    res.error("Something went wrong!", 400, err);
  }
};

export default getCreatorsController;
