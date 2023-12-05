import Joi from "joi";

export const schema = Joi.object({
  image: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required(),
  type: Joi.string(),
  size: Joi.number(),
  text: Joi.string(),
  color: Joi.string().pattern(
    RegExp("^(#|0x)([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$"),
  ),
});

export const schemaArray = Joi.array().items(schema);
