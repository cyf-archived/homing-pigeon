import Joi from "joi";

export const schema = Joi.object({
  key: Joi.string().required(),
  value: Joi.string(),
  start_date: Joi.date(),
  end_date: Joi.date(),
});
