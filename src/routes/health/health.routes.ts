import express from 'express';

import healthController from '../../controllers/health/health.controller.js';

const healthRouter = express.Router();

healthRouter.get("/", healthController);

export default healthRouter;