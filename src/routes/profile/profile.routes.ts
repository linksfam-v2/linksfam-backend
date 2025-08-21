import express from 'express';
import getInfluencerProfileController from '../../controllers/common-profile/getInfluencerProfile.controller.js';
import getInfluencerProfileWithPosts from '../../controllers/common-profile/getInfluencerwithPosts.controller.js';

const profileRouter = express.Router();

// GET /profile/influencer/:username - Get influencer profile by username (public route)
profileRouter.get("/influencer/:username", getInfluencerProfileController);

//GET /profile/influencer/:username/posts - Get influencer profile by username and posts from api with pagination
profileRouter.get("/influencer/:username/posts", getInfluencerProfileWithPosts);

export default profileRouter; 