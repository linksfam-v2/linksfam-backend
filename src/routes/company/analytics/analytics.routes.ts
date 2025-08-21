import express from 'express';

import dashboardController from '../../../controllers/company/analytics/getDashboard.controller.js';
import viewsAmountController from '../../../controllers/company/analytics/viewsAmount.controller.js';

const analyticsRouter = express.Router();

analyticsRouter.get("/:companyId/dashboard", dashboardController);

analyticsRouter.get("/:companyId/views-amount", viewsAmountController);

export default analyticsRouter;