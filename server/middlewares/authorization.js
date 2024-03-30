const asyncHandler = require('../utilities/CatchAsync');
const AppError = require('../utilities/AppError');
const Recipe = require('../model/recipe');
const Review = require('../model/review');

const isProfileAuthor = asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    if (userId !== req.user._id) {
        throw new AppError("Not Authorized", 401);
    }
    next();
});

const isRecipeAuthor = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const recipe = await Recipe.findById(id).populate('author');
    if (!recipe) {
        throw new AppError("Recipe Not Found", 404);
    } else {
        const authorId = recipe.author._id.toString();
        if (authorId !== req.user._id) {
            throw new AppError("Not Authorized", 401);
        } else {
            next();
        }
    }
});

const isReviewAuthor = asyncHandler(async (req, res, next) => {
    const { rId } = req.params;
    const review = await Review.findById(rId).populate('author');
    if (!review) {
        throw new AppError("Recipe Not Found", 404);
    } else {
        const authorId = review.author._id.toString();
        if (authorId !== req.user._id) {
            throw new AppError("Not Authorized", 401);
        } else {
            next();
        }
    }
});

module.exports = {
    isProfileAuthor,
    isRecipeAuthor,
    isReviewAuthor
}