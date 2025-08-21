import { NextFunction, Response, Request} from "express";
import Joi from "joi";

const rateCardSchema = Joi.object({
  reelCharge: Joi.number().min(0).allow(null).optional(),
  storyCharge: Joi.number().min(0).allow(null).optional(),
  carouselPostCharge: Joi.number().min(0).allow(null).optional(),
  linkInBioCharge: Joi.number().min(0).allow(null).optional(),
  instagramComboPackage: Joi.number().min(0).allow(null).optional(),
  youtubeShortCharge: Joi.number().min(0).allow(null).optional(),
  youtubeIntegrationCharge: Joi.number().min(0).allow(null).optional(),
  youtubeDedicatedVideoCharge: Joi.number().min(0).allow(null).optional(),
  customComboPackage: Joi.string().max(1000).allow(null).optional(),
  minimumCollaborationValue: Joi.number().min(0).allow(null).optional(),
  availableForBarterDeals: Joi.boolean().optional()
});

const getRateCardQuerySchema = Joi.object({
  influencerId: Joi.number().required()
});

export const validateAddRateCard = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = rateCardSchema.validate(req.body);  
  
  if (error) {
    return res.error(error.details[0].message, 400);
  }
  next();
};

export const validateUpdateRateCard = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = rateCardSchema.validate(req.body);  
  
  if (error) {
    return res.error(error.details[0].message, 400);
  }
  next();
};

export const validateGetRateCard = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = getRateCardQuerySchema.validate(req.query);  
  
  if (error) {
    return res.error(error.details[0].message, 400);
  }
  next();
}; 