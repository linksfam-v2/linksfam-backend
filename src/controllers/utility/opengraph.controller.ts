import { Request, Response } from 'express';
import { fetchOpenGraphData } from '../../utility/opengraph.js';

/**
 * Fetches OpenGraph data from a URL
 * @param req Request with url query parameter
 * @param res Response
 */
const getOpenGraphDataController = async (req: Request, res: Response) => {
  const url = req.query.url as string | undefined;

  if (!url) {
    return res.error('URL query parameter is required', 400);
  }

  try {
    const data = await fetchOpenGraphData(url);
    return res.success(data);
  } catch (error) {
    console.error('Error in OpenGraph endpoint:', error);
    return res.error('Failed to fetch data from URL', 500, error);
  }
};

export default getOpenGraphDataController; 