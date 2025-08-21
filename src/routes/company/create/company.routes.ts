import express from 'express';

import companyCreateController from '../../../controllers/company/create/create.controller.js';

const companyProfileRouter = express.Router();

companyProfileRouter.post("/", companyCreateController);

export default companyProfileRouter;