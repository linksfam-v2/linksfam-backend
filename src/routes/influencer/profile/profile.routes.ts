import express from 'express';
import createProfileInfluencerController from '../../../controllers/influencer/profile/create.controller.js';
import getProfileInfluencerController from '../../../controllers/influencer/profile/getProfile.controller.js';
import getProfileUserInfluencerController from '../../../controllers/influencer/profile/getUser.controller.js';
import getProfileInfluencerByIdController from '../../../controllers/influencer/profile/getInfluencerProfileById.controller.js';
import checkEligibilityController from '../../../controllers/influencer/profile/checkEligibility.controller.js';

const profileRouter = express.Router();

profileRouter.post("/create", createProfileInfluencerController);

profileRouter.get("/get", getProfileInfluencerController);

profileRouter.get("/user", getProfileUserInfluencerController);

profileRouter.get("/get/:id", getProfileInfluencerByIdController);

profileRouter.post("/check-eligibility", checkEligibilityController);

export default profileRouter;