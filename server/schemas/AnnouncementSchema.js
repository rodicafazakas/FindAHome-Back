const Joi = require("express-validation");

const announcementValidation = {
  body: Joi.object({
    price: Joi.number().required(),
    image: Joi.array().items(Joi.string()).required(),
    area: Joi.number().required(),
    bedrooms: Joi.number().required(),
    bathrooms: Joi.number().required(),
    description: Joi.string().min(20).max(1000).required(),
    parking: Joi.boolean(),
    terrace: Joi.boolean(),
    elevator: Joi.boolean(),
    city: Joi.string().valid("Barcelona", "Madrid"),
    neighbourhood: Joi.string().required(),
    propertyType: Joi.string(),
    dwellingType: Joi.string().valid("apartment", "house").required(),
    address: Joi.object({
      street: Joi.string().required(),
      floor: Joi.number().required(),
      coordinates: Joi.object({
        longitude: Joi.number(),
        latitude: Joi.number(),
      }),
    }),
  }),
};

module.exports = announcementValidation;
