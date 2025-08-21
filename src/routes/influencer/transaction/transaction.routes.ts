import express from 'express';
import getInfluencerTransaction from '../../../controllers/influencer/transaction/getInfluencerTransaction.controller.js';

const transactionRouter = express.Router();

transactionRouter.get("/:influencerId/get", getInfluencerTransaction);

export default transactionRouter;