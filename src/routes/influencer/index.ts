import express from 'express';
import socialRouter from './social/social.routes.js';
import profileRouter from './profile/profile.routes.js';
import linkRouter from './link/link.routes.js';
import transactionRouter from './transaction/transaction.routes.js';
import walletRouter from './wallet/wallet.routes.js';
import analyticsRouter from './analytics/analytics.routes.js';
import shopPostRouter from './shopPost/shopPost.routes.js';
import productsRouter from './products/products.routes.js';
import rateCardRouter from './rateCard/rateCard.routes.js';

const influencerRouter = express.Router();

influencerRouter.use("/social", socialRouter);

influencerRouter.use("/profile", profileRouter);

influencerRouter.use("/link", linkRouter);

influencerRouter.use("/transaction", transactionRouter);

influencerRouter.use("/wallet", walletRouter);

influencerRouter.use("/analytics", analyticsRouter);

influencerRouter.use("/shop-post", shopPostRouter);

influencerRouter.use("/products", productsRouter);

influencerRouter.use("/rate-card", rateCardRouter);

export default influencerRouter;