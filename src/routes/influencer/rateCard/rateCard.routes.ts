import express from 'express';
import addRateCardController from '../../../controllers/influencer/rateCard/addRateCard.controller.js';
import updateRateCardController from '../../../controllers/influencer/rateCard/updateRateCard.controller.js';
import { validateAddRateCard, validateUpdateRateCard } from '../../../validation/influencer/rateCard.validation.js';

const rateCardRouter = express.Router();

// Add a new rate card (requires authentication)
rateCardRouter.post("/", validateAddRateCard, addRateCardController);

// Update existing rate card (requires authentication)
rateCardRouter.put("/", validateUpdateRateCard, updateRateCardController);

export default rateCardRouter; 