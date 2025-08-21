import { NextFunction, Response, Request} from "express";
import Joi from "joi";

const querySchema = Joi.object({
  influencerId: Joi.number().required(),
  linkId: Joi.number().required(),
});

const getquerySchema = Joi.object({
  influencerId: Joi.number().required(),
});


const validateCreateShortlink = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = querySchema.validate(req.body);  
  
  if (error) {
    return res.error(error.details[0].message);
  }
  next();
};

export const validateGetCreateShortlink = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = getquerySchema.validate(req.body);  
  
  if (error) {
    return res.error(error.details[0].message);
  }
  next();
};

export default validateCreateShortlink;