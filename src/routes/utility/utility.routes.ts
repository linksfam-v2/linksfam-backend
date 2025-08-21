import express from 'express';
import getOpenGraphDataController from '../../controllers/utility/opengraph.controller.js';
import refreshMediaUrlsController from '../../controllers/influencer/shopPost/refreshMediaUrls.controller.js';

const utilityRouter = express.Router();

// OpenGraph data endpoint
utilityRouter.get("/opengraph", getOpenGraphDataController);

// Refresh media URLs for shop post (public endpoint)
utilityRouter.get("/shop-post/:id/refresh-media", refreshMediaUrlsController);

export default utilityRouter; 