import Joi from "joi";

const subtitle = Joi.object({
  id: Joi.string(),
  title: Joi.string().required(),
  color: Joi.string().pattern(
    RegExp("^(#|0x)([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$"),
  ),
});

const link = Joi.object({
  id: Joi.string(),
  type: Joi.string().allow("link", "text").default("link").required(),
  text: Joi.string(),
  href: Joi.string().uri({ scheme: ["http", "https"] }),
  color: Joi.string().pattern(
    RegExp("^(#|0x)([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$"),
  ),
});

const description = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  links: Joi.array().items(link).min(1).required(),
});

export const schema = Joi.object({
  title: Joi.string().min(0).max(30).required(),
  subtitles: Joi.array().items(subtitle),
  tips: Joi.array().items(link),
  descriptions: Joi.array().items(description),
});
