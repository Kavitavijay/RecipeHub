import {
    initializeStickyNavbar,
    initializeMobileMenu,
    initializeSmoothScroll,
    initializeScrollButton,
    initializeRevealAnimation,
    initializeAnimations
} from "./animation.js";

import { initializeSearch,searchRecipes, getCurrentSearch, initializeSearchFeatures} from "./search.js";

/*import { initializeFilters, applyFilters } from "./filter.js";*/



import { initializeUtilities, showToast } from "./utils.js";

/*
==========================================================
RecipeHub
Main Application Controller

Author: Your Name

==========================================================
*/

import {

    getAllRecipes,
    getFeaturedRecipes,
    filterRecipes,
    getCategories

} from "./api.js";

/*=========================================================
DOM Elements
=========================================================*/

const recipeContainer =
    document.querySelector("#recipeContainer");

const featuredContainer =
    document.querySelector("#featuredRecipes");

const searchInput =
    document.querySelector("#searchInput");

const categoryContainer =
    document.querySelector("#categoryContainer");

const totalRecipes =
    document.querySelector("#totalRecipes");

/*=========================================================
Application State
=========================================================*/

const state = {

    recipes: [],

    filteredRecipes: [],

    category: "All",

    search: ""

};

/*=========================================================
Initialize Application
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();
    

});

/*=========================================================
Initialize
=========================================================*/

function initializeApp() {


    initializeUtilities();

    initializeStickyNavbar();

    initializeMobileMenu();

    initializeSmoothScroll();

    initializeScrollButton();

    initializeRevealAnimation();

    initializeAnimations();

    state.recipes = getAllRecipes();

    state.filteredRecipes = [...state.recipes];

    renderFeaturedRecipes();

    renderCategories();

    renderRecipes(state.filteredRecipes);

    updateRecipeCount();

    // initializeFilters(handleFilters);

    initializeSearch(state.recipes,renderRecipes, updateRecipeCount);

    initializeSearchFeatures(state.recipes);

    initializeEvents();


}

/*=========================================================
Render Recipe Cards
=========================================================*/

function renderRecipes(recipes) {

    if (!recipeContainer) return;

    if (recipes.length === 0) {

        recipeContainer.innerHTML = noRecipeHTML();

        return;

    }

    recipeContainer.innerHTML = recipes

        .map(recipeCard)

        .join("");

}

/*=========================================================
Recipe Card
=========================================================*/

function recipeCard(recipe) {

    const favorites = JSON.parse(

        localStorage.getItem("favoriteRecipes")

    ) || [];

    const isFavorite = favorites.includes(recipe.id);

    return `

<div class="recipe-card">

    <div class="recipe-image">

        <img
            src="${recipe.image}"
            alt="${recipe.title}"
            loading="lazy">

        <button

            class="favorite-icon ${isFavorite ? "active" : ""}"

            data-favorite="${recipe.id}"

            aria-label="Favorite Recipe">

            ${isFavorite ? "❤️" : "🤍"}

        </button>

        <span class="recipe-rating">

            ⭐ ${recipe.rating}

        </span>

    </div>

    <div class="recipe-content">

        <span class="recipe-category">

            ${recipe.category}

        </span>

        <h3>

            ${recipe.title}

        </h3>

        <p>

            ${recipe.description}

        </p>

        <div class="recipe-meta">

            <span>

                ⏱ ${recipe.cookingTime}

            </span>

            <span>

                👨‍🍳 ${recipe.difficulty}

            </span>

        </div>

        <button

            class="view-btn"

            data-id="${recipe.id}">

            View Recipe

        </button>

    </div>

</div>

`;

}

/*=========================================================
Featured Recipes
=========================================================*/

function renderFeaturedRecipes() {

    if (!featuredContainer) return;

    const featured = getFeaturedRecipes(6);

    featuredContainer.innerHTML = featured

        .map(recipeCard)

        .join("");

}

/*=========================================================
Categories
=========================================================*/

function renderCategories() {

    if (!categoryContainer) return;

    const categories = getCategories();

    categoryContainer.innerHTML = categories

        .map(category => `

<button
class="category-btn
${category === "All" ? "active" : ""}"

data-category="${category}">

${category}

</button>

`)

        .join("");

}

/*=========================================================
Recipe Counter
=========================================================*/

function updateRecipeCount() {

    if (!totalRecipes) return;

    totalRecipes.textContent =

        state.filteredRecipes.length;

}

/*=========================================================
No Recipes Found
=========================================================*/

function noRecipeHTML() {

    return `

<div class="no-results">

    <img
        src="assets/images/no-results.jpg"
        alt="No Results">

    <h2>

        No recipes found

    </h2>

    <p>

        Try another keyword or category.

    </p>

</div>

`;

}

/*=========================================================
Search
=========================================================*/
function handleSearch(event) {

    state.search = event.target.value.trim();

    state.filteredRecipes = filterRecipes({
        category: state.category,
        search: state.search
    });

    renderRecipes(state.filteredRecipes);

    updateRecipeCount();

}

/*=========================================================
Category Filter
=========================================================*/
function handleCategoryClick(event) {

    const button = event.target.closest(".category-btn");

    if (!button) return;

    state.category = button.dataset.category;

    document
        .querySelectorAll(".category-btn")
        .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    state.filteredRecipes = filterRecipes({
        category: state.category,
        search: state.search
    });

    renderRecipes(state.filteredRecipes);

    document.querySelector("#recipes")?.scrollIntoView({
    behavior: "smooth"
    });

    updateRecipeCount();

}

/*=========================================================
Recipe Card Events
=========================================================*/

function handleRecipeClick(event) {

    const button = event.target.closest(".view-btn");

    if (!button) return;

    const recipeId = button.dataset.id;

    window.location.href = `recipe.html?id=${recipeId}`;

}

/*=========================================================
Favorites
=========================================================*/

function toggleFavorite(recipeId) {

    let favorites = JSON.parse(

        localStorage.getItem("favoriteRecipes")

    ) || [];

    recipeId = Number(recipeId);

    if (favorites.includes(recipeId)) {

        favorites = favorites.filter(

            id => id !== recipeId

        );

        showToast("🗑 Removed from Favorites");

    } else {

        favorites.push(recipeId);

        showToast("❤️ Added to Favorites");

    }

    localStorage.setItem(

        "favoriteRecipes",

        JSON.stringify(favorites)

    );

    renderRecipes(state.filteredRecipes);

    renderFeaturedRecipes();

}

function handleFavorite(event) {

    const button = event.target.closest(".favorite-icon");

    if (!button) return;

    event.stopPropagation();

    toggleFavorite(button.dataset.favorite);

}
/*=========================================================
Initialize Events
=========================================================*/

function initializeEvents() {

    if (searchInput) {

        searchInput.addEventListener(

            "input",

            handleSearch

        );

    }
    const searchButton =
    document.querySelector("#searchButton");

    searchButton?.addEventListener("click", () => {

        const query = searchInput.value.trim();

        if (!query) return;

        handleSearch({
            target: searchInput
        });

        document.querySelector("#recipes")?.scrollIntoView({
            behavior: "smooth"
        });

    });

searchInput?.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        const query = searchInput.value.trim();

        if (!query) return;

        handleSearch({
            target: searchInput
        });

        document.querySelector("#recipes")?.scrollIntoView({
            behavior: "smooth"
        });

    }

});
    if (categoryContainer) {

        categoryContainer.addEventListener(

            "click",

            handleCategoryClick

        );

    }

    document.addEventListener(

        "click",

        handleRecipeClick

    );

    document.addEventListener(

        "click",

        handleFavorite

    );

}
/*=========================================================
Filter functions
=========================================================*/

function handleFilters(filters) {

    const filteredRecipes =

        applyFilters(

            state.recipes,

            filters

        );

    state.filteredRecipes =

        filteredRecipes;

    renderRecipes(

        state.filteredRecipes

    );

}
