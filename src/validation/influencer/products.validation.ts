import { NextFunction, Response, Request } from "express";
import Joi from "joi";

const productSchema = Joi.object({
  productUrl: Joi.string().uri().required().messages({
    'string.empty': 'Product URL is required',
    'string.uri': 'Product URL must be a valid URL',
    'any.required': 'Product URL is required'
  }),
  productName: Joi.string().optional().allow('').messages({
    'string.empty': 'Product name can be empty'
  }),
  imageUrl: Joi.string().optional().allow('').custom((value, helpers) => {
    if (value && value.trim() !== '') {
      try {
        new URL(value);
        return value;
      } catch {
        return helpers.error('string.uri');
      }
    }
    return value;
  }).messages({
    'string.uri': 'Image URL must be a valid URL when provided'
  }),
  productDescription: Joi.string().optional().allow('').messages({
    'string.empty': 'Product description can be empty'
  }),
  sitename: Joi.string().optional().allow('').messages({
    'string.empty': 'Site name can be empty'
  }),
  price: Joi.number().min(0).allow(null).optional().messages({
    'number.min': 'Price must be a non-negative number',
    'number.base': 'Price must be a valid number'
  })
});

const updateProductSchema = Joi.object({
  productUrl: Joi.string().uri().optional().messages({
    'string.empty': 'Product URL cannot be empty if provided',
    'string.uri': 'Product URL must be a valid URL when provided'
  }),
  productName: Joi.string().optional().allow('').messages({
    'string.empty': 'Product name can be empty'
  }),
  imageUrl: Joi.string().optional().allow('').custom((value, helpers) => {
    if (value && value.trim() !== '') {
      try {
        new URL(value);
        return value;
      } catch {
        return helpers.error('string.uri');
      }
    }
    return value;
  }).messages({
    'string.uri': 'Image URL must be a valid URL when provided'
  }),
  productDescription: Joi.string().optional().allow('').messages({
    'string.empty': 'Product description can be empty'
  }),
  sitename: Joi.string().optional().allow('').messages({
    'string.empty': 'Site name can be empty'
  }),
  price: Joi.number().min(0).allow(null).optional().messages({
    'number.min': 'Price must be a non-negative number',
    'number.base': 'Price must be a valid number'
  })
});

export const validateAddProduct = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = productSchema.validate(req.body);
  
  if (error) {
    return res.error(error.details[0].message, 400);
  }
  next();
};

export const validateUpdateProduct = (req: Request, res: Response, next: NextFunction): void => {
  const { error } = updateProductSchema.validate(req.body);
  
  if (error) {
    return res.error(error.details[0].message, 400);
  }
  next();
}; 