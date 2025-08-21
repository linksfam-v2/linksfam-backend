import express from 'express';
import healthRouter from './health/health.routes.js';
import authRouter from './auth/auth.routes.js';
import companyRouter from './company/index.js';
import { authenticatedUser } from '../middlewares/auth.js';
import influencerRouter from './influencer/index.js';
import generalProfileRouter from './common-profile/common-profile.routes.js';
import phylloRouter from './phyllo/phyllo.routes.js';
import adminRouter from './admin/admin.routes.js';
import thirdPartyRouter from './thirdParty/thirdParty.routes.js';
import pgRouter from './pgRouter/pgRouter.routes.js';
import socialRouter from './social/social.routes.js';
import partnerRouter from './company/partner/partner.routes.js';
import pixelRouter from './pixel/pixel.route.js';
import utilityRouter from './utility/utility.routes.js';
import profileRouter from './profile/profile.routes.js';
import publicProductsRouter from './public/products.routes.js';
import publicRateCardRouter from './public/rateCard.routes.js';
import topInfluencersRouter from './public/topInfluencers.routes.js';

const router = express.Router();

router.use('/health', healthRouter);

router.use('/auth', authRouter);

// Public profile routes (no authentication required)
router.use('/profile', profileRouter);

router.use('/company', authenticatedUser, companyRouter);

router.use('/influencer', authenticatedUser, influencerRouter);

router.use('/common-profile', authenticatedUser, generalProfileRouter);

router.use('/phyllo', authenticatedUser, phylloRouter);

router.use('/admin', adminRouter);

router.use('/third-party', authenticatedUser, thirdPartyRouter);

router.use("/pg", authenticatedUser, pgRouter);

router.use("/social", socialRouter)

router.use("/partner", partnerRouter);

router.use("/pixel", pixelRouter);

router.use("/utility", utilityRouter);

// Public products endpoint (no authentication required)
router.use("/products", publicProductsRouter);

// Public rate card endpoint (no authentication required)
router.use("/rate-card", publicRateCardRouter);

// Public top influencers endpoint (no authentication required)
router.use("/top-influencers", topInfluencersRouter);

export default router;