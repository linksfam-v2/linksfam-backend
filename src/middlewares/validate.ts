 
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.query);
    if (error) {
      res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: error.details.map((detail) => detail.message),
      });
      return; // Ensure the middleware doesn't continue execution
    }
    next(); // Call the next middleware if validation passes
  };
};

export const validateParams= (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.params);
    if (error) {
      res.status(400).json({
        status: 'error',
        message: 'Validation error',
        details: error.details.map((detail) => detail.message),
      });
      return; // Ensure the middleware doesn't continue execution
    }
    next(); // Call the next middleware if validation passes
  };
};


export default 
  validateQuery;
