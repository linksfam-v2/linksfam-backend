import express from 'express';
import dashboardController from '../../../controllers/influencer/analytics/getDashboard.controller.js';
import viewsAmountController from '../../../controllers/influencer/analytics/viewsAmount.controller.js';
import incomeTableController from '../../../controllers/influencer/analytics/getTableIncome.controller.js';

const analyticsRouter = express.Router();

analyticsRouter.get("/:influencerId/dashboard", dashboardController);

analyticsRouter.get("/:influencerId/views-amount", viewsAmountController);

analyticsRouter.get("/:influencerId/table", incomeTableController);

export default analyticsRouter;