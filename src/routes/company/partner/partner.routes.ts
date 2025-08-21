import express from 'express';
import partnerController from '../../../controllers/company/partner/partner.controller.js';
import partnerProductsController from '../../../controllers/company/partner/partnerProducts.controller.js';
import partnerProductController from '../../../controllers/company/partner/partnerProduct.controller.js';
import parterBulkController from '../../../controllers/company/partner/partner.bulk.controller.js';
import parterLinkShortController from '../../../controllers/company/partner/partnerLink.controller.js';

const partnerRouter = express.Router();

partnerRouter.get("/:id", partnerController);

partnerRouter.get("/:id/products", partnerProductsController);

partnerRouter.get("/:id/product/:pid", partnerProductController);

partnerRouter.post("/bulk", parterBulkController);

partnerRouter.post("/shlink", parterLinkShortController)

export default partnerRouter;