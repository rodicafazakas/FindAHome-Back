const Joi = require("express-validation");

const announcementValidation = {
  body: Joi.object({
    price: Joi.number().required(),
    image: Joi.string().required(),
    area: Joi.number().required(),
    bedrooms: Joi.number().required(),
    bathrooms: Joi.number().required(),
    description: Joi.string().min(20).max(1000).required(),
    parking: Joi.boolean(),
    terrace: Joi.boolean(),
    elevator: Joi.boolean(),
    city: Joi.string(),
    neighbourhood: Joi.string().required(),
    propertyType: Joi.string().required(),
    dwellingType: Joi.string().required(),
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
