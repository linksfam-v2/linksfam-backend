
import express from 'express';
import thirdPartyVcomissionController from '../../controllers/thirdParty/vcomission.controller.js';
import brandsController from '../../controllers/thirdParty/brands.controller.js';
const thirdPartyRouter = express.Router();

thirdPartyRouter.get('/vcomission',  thirdPartyVcomissionController);

thirdPartyRouter.get('/brands',  brandsController);

export default thirdPartyRouter;