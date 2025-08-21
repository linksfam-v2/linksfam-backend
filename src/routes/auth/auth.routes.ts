import express from 'express';
import emailController from '../../controllers/auth/email.controller.js';
import otpController from '../../controllers/auth/otp.controller.js';
import phoneController from '../../controllers/auth/phone.controller.js';
import OTPSentCobntroller from '../../controllers/auth/resent.controller.js';
import GoogleController from '../../controllers/auth/google.controller.js';
import { authenticatedUser } from '../../middlewares/auth.js';
import authUserController from '../../controllers/auth/authUser.controller.js';

const authRouter = express.Router();

authRouter.post("/email", emailController);

authRouter.post("/phone", phoneController);

authRouter.post("/otp", otpController);

authRouter.post("/resend", OTPSentCobntroller);

authRouter.post("/google", GoogleController);

authRouter.get("/user", authenticatedUser,  authUserController);

export default authRouter;