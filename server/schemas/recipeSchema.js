const Joi = require('joi');

module.exports.recipeSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    ingredients: Joi.array().items(Joi.string()).required(),
    instructions: Joi.array().items(Joi.string()).required(),
    cookingTime: Joi.number().min(0).max(120).required(),
    servings: Joi.number().min(1).max(20).required(),
    createdAt: Joi.date().default(new Date()),
    updatedAt: Joi.date().default(new Date()),
    category: Joi.string(),
    tags: Joi.array(),
    reviews: Joi.array()
});