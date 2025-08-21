import Joi from 'joi';

export const createShopPostValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(''),
  productUrls: Joi.array().items(Joi.string().uri()).required(),
  mediaUrl: Joi.string().required().uri(),
  thumbnailUrl: Joi.string().uri().optional(),
  igPostId: Joi.string().optional(),
  mediaExpiry: Joi.date().optional()
});

export const updateShopPostValidation = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(''),
  productUrls: Joi.array().items(Joi.string().uri()).optional(),
  mediaUrl: Joi.string().uri().optional(),
  thumbnailUrl: Joi.string().uri().optional(),
  igPostId: Joi.string().optional(),
  mediaExpiry: Joi.date().optional()
}); 