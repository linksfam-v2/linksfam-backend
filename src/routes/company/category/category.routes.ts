import express from 'express';
import getCategoryController from '../../../controllers/company/category/category.controller.js';


const categoryRouter = express.Router();

categoryRouter.get("/", getCategoryController);

export default categoryRouter;