import express from 'express';
import categoryRouter from './category/category.routes.js';
import companyProfileRouter from './create/company.routes.js';
import linksRouter from './links/links.routes.js';
import profileRouter from './profile/profile.routes.js';
import walletRouter from './wallet/wallet.routes.js';
import transactionRouter from './transaction/transaction.routes.js';
import analyticsRouter from './analytics/analytics.routes.js';
import requestRefundRouter from "./refund/refund.router.js";

const companyRouter = express.Router();

companyRouter.use("/category", categoryRouter);

companyRouter.use("/link", linksRouter);

companyRouter.use("/create", companyProfileRouter);

companyRouter.use("/profile", profileRouter);

companyRouter.use("/wallet", walletRouter);

companyRouter.use("/transaction", transactionRouter);

companyRouter.use("/analytics", analyticsRouter);

companyRouter.use("/request-refund", requestRefundRouter);

export default companyRouter;