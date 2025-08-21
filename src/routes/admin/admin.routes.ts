import express from 'express';
import adminLoginController from '../../controllers/admin/adminLogin.controller.js';
import {deleteController, getAdminCategoryController, postCategoryController, putCategoryController} from "../../controllers/admin/category.controller.js";
import { deleteSourceController, getAdminSourceController, postSourceController, putSourceController } from '../../controllers/admin/source.controller.js';
import { deletePaymentstrategyController, getAdminPaymentstrategyController, postPaymentstrategyController, putPaymentstrategyController } from '../../controllers/admin/paymentStrategy.controller.js';
import { deleteBrandController, getBrandsController, postBrandController, putBrandController } from '../../controllers/admin/brand.controller.js';
import { deleteadvertistmentController, getAdminadvertistmentController, postadvertistmentController, putadvertistmentController } from '../../controllers/admin/affiliate.controller.js';
import { deleteLinkController, getAdminLinkController, postLinkController, putLinkController } from '../../controllers/admin/adminLink.controller.js';
import { getAdminBrandMoneyController, putAdminBrandMoneyController } from '../../controllers/admin/adminWalletBrand.controller.js';
import { getAdminConfirmPayment, postAdminConfirmPayment } from '../../controllers/admin/adminConfirmPayment.controller.js';
import { getAdminRequestRefundController, postAdminRequestRefundController } from '../../controllers/admin/adminRefund.controller.js';
import { getUsersControllerForAdmin } from '../../controllers/admin/getUsersControllerForAdmin.controller.js';
import { deleteAffiliateController, getAffiliateController, postAffiliateController, putAffiliateController } from '../../controllers/admin/affiliateCreate.controller.js';
import getadminShortLinkCntroller from '../../controllers/admin/getShortLink.controller.js';
import addAffiliateData from '../../controllers/admin/postAmazon.controller.js';
import getAffiliateData from '../../controllers/admin/getAffiliateData.controller.js';
import partnerLinksGetController from '../../controllers/admin/partnergetlink.controller.js';
import getAdminSocialAccounts from '../../controllers/admin/getAdminSocialAccounts.controller.js';
import getUserById from '../../controllers/admin/getUserById.controller.js';
const adminRouter = express.Router();

adminRouter.post("/login", adminLoginController);

adminRouter.get("/category", getAdminCategoryController);

adminRouter.post("/category/add", postCategoryController);

adminRouter.put("/category/:id/update", putCategoryController);

adminRouter.delete("/category/:id/delete", deleteController);

adminRouter.get("/source", getAdminSourceController);

adminRouter.post("/source/add", postSourceController);

adminRouter.put("/source/:id/update", putSourceController);

adminRouter.delete("/source/:id/delete", deleteSourceController);

adminRouter.get("/payment-strategy", getAdminPaymentstrategyController);

adminRouter.post("/payment-strategy/add", postPaymentstrategyController);

adminRouter.put("/payment-strategy/:id/update", putPaymentstrategyController);

adminRouter.delete("/payment-strategy/:id/delete", deletePaymentstrategyController);

adminRouter.get("/brand", getBrandsController);

adminRouter.post("/brand/add", postBrandController);

adminRouter.put("/brand/:id/update", putBrandController);

adminRouter.delete("/brand/:id/delete", deleteBrandController);

adminRouter.get("/advertistment", getAdminadvertistmentController);

adminRouter.post("/advertistment/add", postadvertistmentController);

adminRouter.put("/advertistment/:id/update", putadvertistmentController);

adminRouter.delete("/advertistment/:id/delete", deleteadvertistmentController);


adminRouter.get("/link", getAdminLinkController);

adminRouter.post("/link/add", postLinkController);

adminRouter.put("/link/:id/update", putLinkController);

adminRouter.delete("/link/:id/delete", deleteLinkController);

adminRouter.get("/shortlink", getadminShortLinkCntroller);

// Add Money

adminRouter.get("/money", getAdminBrandMoneyController);

adminRouter.post("/money", putAdminBrandMoneyController);

// End of add Money

// Confirm payment

adminRouter.get("/confirm-payment", getAdminConfirmPayment);

adminRouter.post("/confirm-payment", postAdminConfirmPayment);

// End of confirm payment

// Refund apis

adminRouter.get("/refund", getAdminRequestRefundController);

adminRouter.post("/refund", postAdminRequestRefundController);

// End of refund apis

// Fetch for users
adminRouter.get("/users", getUsersControllerForAdmin);
// End of user

// Affliates
adminRouter.get("/affiliate", getAffiliateController);

adminRouter.post("/affiliate/amazon", addAffiliateData);

adminRouter.get("/affiliate/get-amazon", getAffiliateData);

adminRouter.post("/affiliate/add", postAffiliateController);

adminRouter.put("/affiliate/:id/update", putAffiliateController);

adminRouter.delete("/affiliate/:id/delete", deleteAffiliateController);
// End of affiliates

adminRouter.get("/get-link", partnerLinksGetController)

adminRouter.get("/social/accounts", getAdminSocialAccounts);

adminRouter.get("/users/:id", getUserById);

export default adminRouter;