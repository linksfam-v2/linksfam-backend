import express from 'express';
import checkoutController from '../../controllers/pg/checkout.controller.js';

const pgRouter = express.Router();

pgRouter.post("/", checkoutController);

export default pgRouter;