
import express from 'express';
import getInvoiceTransaction from '../../../controllers/company/transaction/getInvoiceTrans.controller.js';

const transactionRouter = express.Router();

transactionRouter.get("/:companyId/get", getInvoiceTransaction);

export default transactionRouter;