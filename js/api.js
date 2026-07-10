/*
==========================================================
RecipeHub
API Layer

Author: Your Name

Description:
Handles all recipe data operations.

==========================================================
*/

import { recipes } from "./data.js";

/*=========================================
    Get All Recipes
=========================================*/

export function getAllRecipes() {
    return recipes;
}

/*=========================================
    Get Recipe By ID
=========================================*/

export function getRecipeById(id) {

    return recipes.find(recipe => recipe.id === Number(id));

}

/*=========================================
    Get Recipe By Slug
=========================================*/

export function getRecipeBySlug(slug) {

    return recipes.find(recipe => recipe.slug === slug);

}

/*=========================================
    Search Recipes
=========================================*/

export function searchRecipes(searchText) {

    const query = searchText.trim().toLowerCase();

    if (!query) return recipes;

    return recipes.filter(recipe => {

        return (

            recipe.title.toLowerCase().includes(query) ||

            recipe.description.toLowerCase().includes(query) ||

            recipe.category.toLowerCase().includes(query) ||

            recipe.cuisine.toLowerCase().includes(query) ||

            recipe.tags.some(tag =>
                tag.toLowerCase().includes(query)
            )

        );

    });

}

/*=========================================
    Filter By Category
=========================================*/

export function filterByCategory(category) {

    if (
        category === "All" ||
        category === ""
    ) {
        return recipes;
    }

    return recipes.filter(recipe =>

        recipe.category.toLowerCase() ===
        category.toLowerCase()

    );

}

/*=========================================
    Filter By Cuisine
=========================================*/

export function filterByCuisine(cuisine) {

    if (
        cuisine === "All" ||
        cuisine === ""
    ) {
        return recipes;
    }

    return recipes.filter(recipe =>

        recipe.cuisine.toLowerCase() ===
        cuisine.toLowerCase()

    );

}

/*=========================================
    Filter By Difficulty
=========================================*/

export function filterByDifficulty(level) {

    if (
        level === "All" ||
        level === ""
    ) {
        return recipes;
    }

    return recipes.filter(recipe =>

        recipe.difficulty.toLowerCase() ===
        level.toLowerCase()

    );

}

/*=========================================
    Featured Recipes
=========================================*/

export function getFeaturedRecipes(limit = 6) {

    return [...recipes]

                .sort((a, b) => {

            if (b.rating === a.rating) {
                return b.reviews - a.reviews;
            }

            return b.rating - a.rating;

        })

        .slice(0, limit);

}

/*=========================================
    Popular Recipes
=========================================*/

export function getPopularRecipes(limit = 8) {

    return [...recipes]

        .sort((a, b) => b.reviews - a.reviews)

        .slice(0, limit);

}

/*=========================================
    Latest Recipes
=========================================*/

export function getLatestRecipes(limit = 6) {

    return [...recipes]

        .sort((a, b) => b.id - a.id)

        .slice(0, limit);

}

/*=========================================
    Related Recipes
=========================================*/

export function getRelatedRecipes(recipeId, limit = 4) {

    const currentRecipe = getRecipeById(recipeId);

    if (!currentRecipe) return [];

    const related = recipes.filter(recipe =>

        recipe.id !== currentRecipe.id &&

        (
            recipe.category === currentRecipe.category ||

            recipe.cuisine === currentRecipe.cuisine ||

            recipe.tags.some(tag =>
                currentRecipe.tags.includes(tag)
            )

        )

    );

    return related.slice(0, limit);

}

/*=========================================
    Combined Search & Filter
=========================================*/

export function filterRecipes({

    search = "",

    category = "All",

    cuisine = "All",

    difficulty = "All"

} = {}) {

    const query = search.trim().toLowerCase();

    return recipes.filter(recipe => {

        const matchesSearch =
            !query ||

            recipe.title.toLowerCase().includes(query) ||

            recipe.description.toLowerCase().includes(query) ||

            recipe.tags.some(tag =>
                tag.toLowerCase().includes(query)
            );

        const matchesCategory =
            category === "All" ||
            recipe.category === category;

        const matchesCuisine =
            cuisine === "All" ||
            recipe.cuisine === cuisine;

        const matchesDifficulty =
            difficulty === "All" ||
            recipe.difficulty === difficulty;

        return (

            matchesSearch &&
            matchesCategory &&
            matchesCuisine &&
            matchesDifficulty

        );

    });

}

/*=========================================
    Random Recipes
=========================================*/

export function getRandomRecipes(limit = 4) {

    const shuffled = [...recipes].sort(() => Math.random() - 0.5);

    return shuffled.slice(0, limit);

}

/*=========================================
    Categories
=========================================*/

export function getCategories() {

    return [

        "All",

        ...new Set(

            recipes.map(recipe => recipe.category)

        )

    ];

}

/*=========================================
    Cuisines
=========================================*/

export function getCuisines() {

    return [

        "All",

        ...new Set(

            recipes.map(recipe => recipe.cuisine)

        )

    ];

}

/*=========================================
    Difficulty Levels
=========================================*/

export function getDifficultyLevels() {

    return [

        "All",

        ...new Set(

            recipes.map(recipe => recipe.difficulty)

        )

    ];

}

/*=========================================
    Statistics
=========================================*/

export function getStatistics() {

    return {

        totalRecipes: recipes.length,

        totalCategories: getCategories().length - 1,

        totalCuisines: getCuisines().length - 1,

        averageRating:

            (
                recipes.reduce(
                    (sum, recipe) => sum + recipe.rating,
                    0
                ) / recipes.length
            ).toFixed(1)

    };

}