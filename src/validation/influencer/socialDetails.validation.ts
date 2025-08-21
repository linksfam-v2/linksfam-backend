import Joi from 'joi';

export const updateWebsiteValidation = Joi.object({
  socialMediaType: Joi.string().required().messages({
    'string.empty': 'Social media type is required',
    'any.required': 'Social media type is required'
  }),
  website: Joi.string().uri().allow('', null).optional().messages({
    'string.uri': 'Website must be a valid URL'
  })
}); 