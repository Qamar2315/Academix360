const asyncHandler = require('../utilities/CatchAsync');
const Recipe = require('../model/recipe');
const Review = require('../model/review');
const User = require('../model/user');
const AppError = require('../utilities/AppError');

const getRecipes = asyncHandler(async (req, res) => {
    // Fetch all recipes from the database
    const recipes = await Recipe.find({});
    if (recipes) {
        res.status(200).json({
            success: true,
            data: recipes
        });
    } else {
        throw new AppError("Internal Server Error", 400)
    }
})

const getRecipeById = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get recipe ID from request parameters

    // Fetch the recipe from the database using the ID
    const recipe = await Recipe.findById(id)
        .populate({
            path: 'author',
            select: 'name email' // Specify the fields you want to populate for the author
        })
        .populate({
            path: 'reviews',
            populate: { path: 'author', select: 'name' } // Populate nested fields within reviews (assuming there's a 'user' field in reviews)
        });

    if (!recipe) {
        return res.status(404).json({
            success: false,
            message: 'Recipe not found'
        });
    }

    res.status(200).json({
        success: true,
        data: recipe
    });
});


const addRecipe = asyncHandler(async (req, res) => {
    const { title, description, ingredients, instructions, cookingTime, servings, category, tags } = req.body;

    // Check if a recipe with the same title exists
    let existingRecipe = await Recipe.findOne({ title });

    if (existingRecipe) {
        // If a recipe with the same title exists, update data
        existingRecipe.title = title || existingRecipe.title;
        existingRecipe.description = description || existingRecipe.description;
        existingRecipe.ingredients = ingredients || existingRecipe.ingredients;
        existingRecipe.instructions = instructions || existingRecipe.instructions;
        existingRecipe.cookingTime = cookingTime || existingRecipe.cookingTime;
        existingRecipe.servings = servings || existingRecipe.servings;
        existingRecipe.category = category || existingRecipe.category;
        existingRecipe.tags = tags || existingRecipe.tags;
        existingRecipe.updatedAt = Date.now();

        // Save the updated recipe
        await existingRecipe.save();

        res.status(200).json({
            success: true,
            message: 'Recipe data updated successfully',
            data: existingRecipe
        });
    } else {
        // If no recipe with the same title exists, create a new one
        const newRecipe = new Recipe({
            title,
            description,
            ingredients,
            instructions,
            cookingTime,
            servings,
            author: req.user._id,
            category,
            tags
        });

        // Save the new recipe
        await newRecipe.save();
        let user = await User.findById(req.user._id);
        user.recipes.push(newRecipe);
        await user.save();
        res.status(201).json({
            success: true,
            message: 'Recipe added successfully',
            data: newRecipe
        });
    }
});


const updateRecipe = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get recipe ID from request parameters
    const { title, description, ingredients, instructions, cookingTime, servings, category, tags } = req.body;

    // Check if the recipe with the given ID exists
    let recipe = await Recipe.findById(id);

    if (!recipe) {
        return res.status(404).json({
            success: false,
            message: 'Recipe not found'
        });
    }

    // Update recipe fields
    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.instructions = instructions || recipe.instructions;
    recipe.cookingTime = cookingTime || recipe.cookingTime;
    recipe.servings = servings || recipe.servings;
    recipe.category = category || recipe.category;
    recipe.tags = tags || recipe.tags;
    recipe.updatedAt = Date.now();

    // Save the updated recipe
    await recipe.save();

    res.status(200).json({
        success: true,
        message: 'Recipe updated successfully',
        data: recipe
    });
});

const deleteRecipe = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get recipe ID from request parameters

    try {
        // Check if the recipe with the given ID exists
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        // Delete associated reviews
        await Review.deleteMany({ _id: { $in: recipe.reviews } });

        // Delete the recipe
        await Recipe.deleteOne({ _id: id });

        res.status(200).json({
            success: true,
            message: 'Recipe and associated reviews deleted successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

module.exports = {
    getRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById
}