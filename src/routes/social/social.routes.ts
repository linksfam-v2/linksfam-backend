import express from 'express';
import connectYTController from '../../controllers/social/connectYt.controller.js';
import callbackController from '../../controllers/social/cacllback.controller.js';
import passport from 'passport';
import { authenticatedUser } from '../../middlewares/auth.js';
import socialDetailsController from '../../controllers/social/getSocial.controller.js';
import connectIgController from '../../controllers/social/connectIg.controller.js';
import finishIgController from '../../controllers/social/finish.Ig.controller.js';
import deactivateSocialController from '../../controllers/social/deactivate.controller.js';
import { getInstagramData } from '../../controllers/instagram/getData.controller.js';
import { callbackIGAuth, getPageInfo } from '../../controllers/instagram/Authinit.controller.js';
import asyncHandler from 'express-async-handler';
import { getInstagramPageData } from '../../controllers/social/getIgPageData.controller.js';
import { getInstagramPostsController } from '../../controllers/social/getInstagramPosts.controller.js';
import getYtVideos from '../../controllers/youtubeAPI/getYtVideos.controller.js';
import postYouTubeShortToInstagramController from '../../controllers/social/postYouTubeShortToInstagram.controller.js';
import { validatePostReel } from '../../validation/influencer/postReel.validation.js';
const socialRouter = express.Router();

socialRouter.get("/yt/connect",   connectYTController);

socialRouter.get("/yt/callback",  passport.authenticate("google",
   { failureRedirect: "https://linksfam.com" }), callbackController);

socialRouter.get("/details",  authenticatedUser , socialDetailsController);

socialRouter.get("/connect/ig" , connectIgController);

socialRouter.post("/finish/ig", authenticatedUser, finishIgController);

socialRouter.get("/det/:id", authenticatedUser, deactivateSocialController);

socialRouter.get('/instagram/data', asyncHandler(getInstagramData));

socialRouter.get('/auth/instagram/callback', asyncHandler(callbackIGAuth));

socialRouter.get('/instagram/page', authenticatedUser ,asyncHandler(getPageInfo)); //this is using facebook login ie graph.facebook.com

socialRouter.get('/instagram/pageinfo', authenticatedUser ,asyncHandler(getInstagramPageData));//this is using instagram login ie graph.instagram.com

socialRouter.get('/instagram/posts',authenticatedUser , asyncHandler(getInstagramPostsController));

socialRouter.get('/youtube/videos', authenticatedUser, asyncHandler(getYtVideos));

// Post YouTube Short to Instagram Reel
socialRouter.post('/post-youtube-short-to-instagram', 
  authenticatedUser, 
  validatePostReel, 
  asyncHandler(postYouTubeShortToInstagramController)
);

export default socialRouter;