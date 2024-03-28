const Joi = require('joi');

module.exports.constituentSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    address: Joi.string(),
    signUpTime: Joi.date().default(new Date())
});
