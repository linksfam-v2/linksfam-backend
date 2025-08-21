import { NextFunction, Response, Request} from "express";
import Joi from "joi";

const querySchema = Joi.object({
  fee: Joi.string().required(),
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  link: Joi.string().required(),
  input_type: Joi.string().required(),
  type: Joi.string().required(),
});

const validateLinkCreate = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = querySchema.validate(req.body);  
  
  if (error) {
    return res.error(error.details[0].message);
  }
  next();
};

export default validateLinkCreate;