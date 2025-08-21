import { NextFunction, Response, Request} from "express";
import Joi from "joi";

const querySchema = Joi.object({
  otp: Joi.string().required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().optional(), 
});

const validateOtp = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = querySchema.validate(req.body);  
  
  if (error) {
    return res.error(error.details[0].message);
  }
  next();
};

export default validateOtp;