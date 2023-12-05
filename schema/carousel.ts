import Joi from "joi";

export const schema = Joi.object({
  image: Joi.string()
    .uri({ scheme: ["http", "https"] })
    .required(),
  order: Joi.number().integer().required(),
  text: Joi.string(),
  color: Joi.string().pattern(
    RegExp("^(#|0x)([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$"),
  ),
  href: Joi.string().uri({ scheme: ["http", "https"] }),
  start_date: Joi.date(),
  end_date: Joi.date(),
});
