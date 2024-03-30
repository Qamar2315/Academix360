const asyncHandler = require('../utilities/CatchAsync')
const Recipe = require('../model/recipe')
const Review = require('../model/review')
const AppError = require('../utilities/AppError')

// POST /api/recipes/:id/reviews
const addReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating, description } = req.body;

    // Check if the recipe with the given ID exists
    const recipe = await Recipe.findById(id);
    if (!recipe) {
        throw new AppError('Recipe not found', 404);
    }

    // Create a new review
    const newReview = new Review({
        rating,
        description,
        author: req.user._id // Assuming you have user authentication and req.user contains user info
    });

    // Save the new review
    await newReview.save();

    // Add the review ID to the recipe's reviews array
    recipe.reviews.push(newReview._id);
    await recipe.save();

    res.status(201).json({
        success: true,
        message: 'Review added successfully',
        data: newReview
    });
});

// DELETE /api/recipes/:id/reviews/:rId
const deleteReview = asyncHandler(async (req, res) => {
    const { id, rId } = req.params;

    // Check if the review with the given ID exists
    const review = await Review.findById(rId);
    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Check if the recipe with the given ID exists
    const recipe = await Recipe.findById(id);
    if (!recipe) {
        throw new AppError('Recipe not found', 404);
    }

    // Remove the review ID from the recipe's reviews array
    recipe.reviews.pull(rId);
    await recipe.save();

    // Delete the review
    await Review.findByIdAndDelete(rId);

    res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
        data: {}
    });
});

module.exports = {
    addReview,
    deleteReview
}
