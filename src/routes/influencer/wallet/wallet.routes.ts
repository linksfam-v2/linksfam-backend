import express from 'express';
import rechargewalletController from '../../../controllers/influencer/wallet/redeem.controller.js';
import walletValueController from '../../../controllers/influencer/wallet/wallet.controller.js';

const walletRouter = express.Router();

walletRouter.post("/redeem", rechargewalletController);

walletRouter.get("/:influencerId/current-value", walletValueController);

export default walletRouter;