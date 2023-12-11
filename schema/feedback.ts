import Joi from "joi";

const file = Joi.object({
  id: Joi.string(),
  url: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required(),
  type: Joi.string(),
  size: Joi.number(),
  title: Joi.string(),
});

export const schema = Joi.object({
  title: Joi.string().min(0).max(100).required(),
  description: Joi.string().min(0).max(500).required(),
  files: Joi.array().items(file),
});
