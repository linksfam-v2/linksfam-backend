import { NextFunction, Response, Request} from "express";
import Joi from "joi";

const querySchema = Joi.object({
  email: Joi.string().email().required(),
  type: Joi.string().required(),
});

const validateEmail = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = querySchema.validate(req.body);  
  
  if (error) {
    return res.error(error.details[0].message);
  }
  next();
};

export default validateEmail;


const phoneQuerySchema = Joi.object({
  phone: Joi.string().required(),
  type: Joi.string().required(),
});

export const validatePhone = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = phoneQuerySchema.validate(req.body);  
  
  if (error) {
    return res.error(error.details[0].message);
  }
  next();
};
