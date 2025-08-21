import { NextFunction, Response, Request} from "express";
import Joi from "joi";

const querySchema = Joi.object({
  name: Joi.string().required(),
  url: Joi.string().uri().required(),
});

const validateCompany = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = querySchema.validate(req.body);  
  
  if (error) {
    return res.error(error.details[0].message);
  }
  next();
};

export default validateCompany;