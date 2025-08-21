import express from 'express';
import createShopPostController from '../../../controllers/influencer/shopPost/create.controller.js';
import getShopPostsController from '../../../controllers/influencer/shopPost/get.controller.js';
import getShopPostByIdController from '../../../controllers/influencer/shopPost/getById.controller.js';
import updateShopPostController from '../../../controllers/influencer/shopPost/update.controller.js';
import deleteShopPostController from '../../../controllers/influencer/shopPost/delete.controller.js';
import getShopPostsByInfluencerIdController from '../../../controllers/influencer/shopPost/getByInfluencerId.controller.js';
import getShopPostWithViewsController from '../../../controllers/influencer/shopPost/getShopPostWithViews.controller.js';

const shopPostRouter = express.Router();

// Create a new shop post
shopPostRouter.post("/", createShopPostController);

// Get all shop posts of the logged-in influencer
shopPostRouter.get("/", getShopPostsController);

// Get shop posts with visit counts by influencer ID
shopPostRouter.post("/views", getShopPostWithViewsController);

// Get shop posts by influencer ID (public endpoint)
shopPostRouter.get("/influencer/:influencerId", getShopPostsByInfluencerIdController);

// Get a specific shop post by ID
shopPostRouter.get("/:id", getShopPostByIdController);

// Update a shop post
shopPostRouter.put("/:id", updateShopPostController);

// Delete a shop post
shopPostRouter.delete("/:id", deleteShopPostController);

export default shopPostRouter; 