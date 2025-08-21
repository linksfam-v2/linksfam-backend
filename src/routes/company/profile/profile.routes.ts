import express from 'express';
import getCompanyProfileController from '../../../controllers/company/create/get.controller.js';
import getCompanUserProfileController from '../../../controllers/company/create/user.controller.js';

const profileRouter = express.Router();

profileRouter.get("/get", getCompanyProfileController);

profileRouter.get("/user", getCompanUserProfileController);

export default profileRouter;