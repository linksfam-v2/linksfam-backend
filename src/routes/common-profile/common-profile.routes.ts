import express from 'express';
import createCommonProfileController from '../../controllers/common-profile/createProfile.controller.js';
import getCommonProfileController from '../../controllers/common-profile/getProfile.controller.js';

const generalProfileRouter = express.Router();

generalProfileRouter.post("/create", createCommonProfileController);

generalProfileRouter.get("/get", getCommonProfileController);

export default generalProfileRouter;