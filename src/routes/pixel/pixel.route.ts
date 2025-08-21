import express from 'express';
import  getPixel  from '../../controllers/pixel/pixel.controller.js';
import asyncHandler from 'express-async-handler';
const pixelRouter = express.Router();

pixelRouter.get('/t.gif', asyncHandler(getPixel));

export default pixelRouter;


