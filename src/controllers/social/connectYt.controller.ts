/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import jwt from "jsonwebtoken";
import passport from 'passport';

declare module "express-session" {
  interface SessionData {
    user?: string;
  }
}

const connectYTController = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.query.token as string;

    if (!token) {
     res.status(400).json({ error: 'Token missing' });
     return;
    }

    const decoded = jwt.verify(token, 'secret') as jwt.JwtPayload;

    const userId = typeof decoded !== 'string' ? decoded?.data?.userId : null;

    if (!userId) {
     res.status(401).json({ error: 'Invalid token payload' });
     return;
    }

    req.session.user = userId;

    passport.authenticate("google", { session: false }, (_err: any, _user: any, _info: any) => {
      return res.status(200).json({ success: true, userId });
    })(req, res, next);

  } catch (err) {
    console.error("connectYTController error:", err);
    res.status(500).json({ error: 'Failed to connect YouTube' });
    return;
  }
};

export default connectYTController;

