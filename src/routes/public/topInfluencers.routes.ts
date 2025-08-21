import express from 'express';
import getTopInfluencersController from '../../controllers/public/topInfluencers.controller.js';

const topInfluencersRouter = express.Router();

topInfluencersRouter.get("/", getTopInfluencersController);

export default topInfluencersRouter; 