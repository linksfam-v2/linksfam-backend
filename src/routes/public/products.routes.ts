import express from 'express';
import getProductsController from '../../controllers/influencer/products/getProducts.controller.js';

const publicProductsRouter = express.Router();

// Get products for an influencer (public endpoint - no authentication required)
publicProductsRouter.get("/", getProductsController);

export default publicProductsRouter; 