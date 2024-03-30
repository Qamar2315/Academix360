const Joi = require('joi');

module.exports.reviewSchema = Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    description: Joi.string().required()
});


