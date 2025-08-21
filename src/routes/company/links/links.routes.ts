import express from 'express';
import createLinksController from '../../../controllers/company/links/createLinks.controller.js';
import validateLinkCreate from '../../../validation/company/link.js';
import fetchLinkByCompanyIdController from '../../../controllers/company/links/fetchLinkByCompany.controller.js';
import { validateParams } from '../../../middlewares/validate.js';
import fetchLinksByCompanySchema from '../../../validation/company/fetchlink.js';
import fetchAllLinksController from '../../../controllers/company/links/fetchLinks.controller.js';
import getCreatorsController from '../../../controllers/company/category/creators.controller.js';

const linksRouter = express.Router();

linksRouter.get("/creators", getCreatorsController);

linksRouter.post("/create", validateLinkCreate, createLinksController);

linksRouter.get("/all", fetchAllLinksController);

linksRouter.get("/:companyId", validateParams(fetchLinksByCompanySchema), fetchLinkByCompanyIdController);

export default linksRouter;