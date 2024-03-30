const express = require('express');
const router = express.Router();
const { getRecipes, getRecipeById, addRecipe, updateRecipe, deleteRecipe } = require('../controllers/recipes');
const { addReview, deleteReview } = require('../controllers/reviews');
const { isLogin } = require("../middlewares/isLogin");
const { isRecipeAuthor, isReviewAuthor } = require("../middlewares/authorization");
const { validateRecipe, validateReview } = require("../middlewares/schemaValidator");

router.route('/')
    .get(getRecipes)
    .post(isLogin, validateRecipe, addRecipe)

router.route('/:id')
    .get(getRecipeById)
    .put(isLogin, validateRecipe , isRecipeAuthor, updateRecipe)
    .delete(isLogin, isRecipeAuthor, deleteRecipe)

router.route('/:id/reviews')
    .post(isLogin, validateReview, addReview)

router.route('/:id/reviews/:rId')
    .delete(isLogin, isReviewAuthor, deleteReview)

module.exports = router;