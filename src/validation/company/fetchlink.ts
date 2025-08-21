import Joi from "joi";

const fetchLinksByCompanySchema = Joi.object({
  companyId: Joi.string().required(),
});

export default fetchLinksByCompanySchema;