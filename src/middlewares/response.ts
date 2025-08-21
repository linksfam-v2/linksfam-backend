/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-namespace */

import { Request, Response, NextFunction } from 'express';

// Extend Express response type to include custom methods
declare global {
  namespace Express {
    interface Response {
      success: (data: any, message?: string) => void;
      error: (message?: string, statusCode?: number, error?: any) => void;
    }
  }
}

// Middleware to standardize response format
const responseUtils = (req: Request, res: Response, next: NextFunction): void => {
  res.success = (data: any, message: string = 'Sucessfully executed!'): void => {
    res.status(200).json({
      code: 200,
      status: 'Success',
      data,
      message,
    });
  };

  res.error = (message: string = 'An error occurred', statusCode: number = 400, error: any = {}): void => {
    res.status(statusCode).json({
      code: 400,
      status: 'error',
      message,
      error,
    });
  };

  next();
};

export default responseUtils;
