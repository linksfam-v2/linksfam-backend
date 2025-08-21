import express from 'express';
import rechargeController from '../../../controllers/company/wallet/recharge.controller.js';
import getWalletController from '../../../controllers/company/wallet/getWallet.controller.js';
import addBankController from '../../../controllers/company/wallet/addBank.controller.js';
import getBankController from '../../../controllers/company/wallet/getBank.controller.js';
import createTempTransactionController from '../../../controllers/company/wallet/createTempTransaction.controller.js';
import intiController from '../../../controllers/company/wallet/init.controller.js';

const walletRouter = express.Router();

walletRouter.post("/init", intiController);

walletRouter.post("/recharge", rechargeController);

walletRouter.get("/:companyId/get", getWalletController);

walletRouter.post("/add-bank", addBankController);

walletRouter.get("/:companyId/get-bank", getBankController);

walletRouter.post("/:companyId/temp-trans", createTempTransactionController);

export default walletRouter;