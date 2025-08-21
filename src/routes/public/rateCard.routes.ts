import express from 'express';
import getRateCardController from '../../controllers/influencer/rateCard/getRateCard.controller.js';
import { validateGetRateCard } from '../../validation/influencer/rateCard.validation.js';

const publicRateCardRouter = express.Router();

// Get rate card for an influencer (public endpoint - no authentication required)
publicRateCardRouter.get("/", validateGetRateCard, getRateCardController);

export default publicRateCardRouter; 