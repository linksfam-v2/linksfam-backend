import { NextFunction, Response, Request } from "express";
import Joi from "joi";

const postReelSchema = Joi.object({
  videoId: Joi.string().required().messages({
    'string.empty': 'Video ID is required',
    'any.required': 'Video ID is required'
  }),
  caption: Joi.string().max(2200).optional().messages({
    'string.max': 'Caption must be less than 2200 characters'
  })
});

export const validatePostReel = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = postReelSchema.validate(req.body);
  
  if (error) {
    return res.error(error.details[0].message, 400);
  }
  next();
}; 