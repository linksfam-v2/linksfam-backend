
import express from 'express';
import addRefundController from '../../../controllers/company/refund/add.controller.js';

const requestRefundRouter = express.Router();

requestRefundRouter.post("/:companyId/post", addRefundController);

export default requestRefundRouter;