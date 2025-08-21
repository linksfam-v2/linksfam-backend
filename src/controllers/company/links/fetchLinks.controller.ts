import { Request, Response } from "express";
import { prisma } from "../../../db/db.js";

const fetchAllLinksController = async (req: Request, res: Response) => {
  const { id = "0", categoryId, page = "1", limit = "10" } = req.query;
  
  try {
    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const whereClause = categoryId ? { categoryId: Number(categoryId) } : undefined;

    if (id === "0") {
      const links = await prisma.link.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          category: true,
          company: true,
          brand: true,
        },
        skip,
        take: pageSize,
      });
      res.success({
        data: links,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil((await prisma.link.count({ where: whereClause })) / pageSize),
          totalItems: await prisma.link.count({ where: whereClause }),
          perPage: pageSize,
        },
      });
    }

    if (id === "1") {
      const links = await prisma.link.findMany({
        where: whereClause,
        orderBy: { createdAt: "asc" },
        include: {
          category: true,
          company: true,
          brand: true,
        },
        skip,
        take: pageSize,
      });
      res.success({
        data: links,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil((await prisma.link.count({ where: whereClause })) / pageSize),
          totalItems: await prisma.link.count({ where: whereClause }),
          perPage: pageSize,
        },
      });
    }

    if (id === "2") {
      const links = await prisma.link.findMany({
        where: whereClause,
        orderBy: { fee: "asc" },
        include: {
          category: true,
          company: true,
          brand: true,
        },
        skip,
        take: pageSize,
      });
      res.success({
        data: links,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil((await prisma.link.count({ where: whereClause })) / pageSize),
          totalItems: await prisma.link.count({ where: whereClause }),
          perPage: pageSize,
        },
      });
    }

    if (id === "3") {
      const links = await prisma.link.findMany({
        where: whereClause,
        orderBy: { fee: "desc" },
        include: {
          category: true,
          company: true,
          brand: true,
        },
        skip,
        take: pageSize,
      });
      res.success({
        data: links,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil((await prisma.link.count({ where: whereClause })) / pageSize),
          totalItems: await prisma.link.count({ where: whereClause }),
          perPage: pageSize,
        },
      });
    }

    if (id === "4") {
      const links = await prisma.link.findMany({
        where: whereClause,
        include: {
          category: true,
          company: true,
          shortLinks: true,
          brand: true,
        },
        orderBy: { shortLinks: { _count: "desc" } },
        skip,
        take: pageSize,
      });
      res.success({
        data: links,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil((await prisma.link.count({ where: whereClause })) / pageSize),
          totalItems: await prisma.link.count({ where: whereClause }),
          perPage: pageSize,
        },
      });
    }

    if (id === "5") {
      const links = await prisma.link.findMany({
        where: whereClause,
        include: {
          category: true,
          company: true,
          shortLinks: true,
          brand: true,
        },
        orderBy: { shortLinks: { _count: "asc" } },
        skip,
        take: pageSize,
      });
      res.success({
        data: links,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil((await prisma.link.count({ where: whereClause })) / pageSize),
          totalItems: await prisma.link.count({ where: whereClause }),
          perPage: pageSize,
        },
      });
    }
  } catch (err: unknown) {
    console.log(err);
    res.error("Something went wrong!", 400, err);
  }
};

export default fetchAllLinksController;
