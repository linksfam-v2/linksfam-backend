import express from 'express';
import createShortlinkController from '../../../controllers/influencer/shortLinks/create.controller.js';
import validateCreateShortlink, { validateGetCreateShortlink } from '../../../validation/influencer/shortlink.js';
import getShortLinkController from '../../../controllers/influencer/shortLinks/getShortLinkWithViews.controller.js';

const linkRouter = express.Router();

linkRouter.post("/create",validateCreateShortlink, createShortlinkController);

linkRouter.post("/get", validateGetCreateShortlink, getShortLinkController);

export default linkRouter;