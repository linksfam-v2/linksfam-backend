import express from 'express';
import createSocialController from '../../../controllers/influencer/social/createSocial.controller.js';
import updateWebsiteController from '../../../controllers/influencer/social/updateWebsite.controller.js';

const socialRouter = express.Router();

socialRouter.post("/", createSocialController);
socialRouter.put("/website", updateWebsiteController);

export default socialRouter;