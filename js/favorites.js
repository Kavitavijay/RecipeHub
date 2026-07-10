/*
==========================================================
RecipeHub
Favorites Page

Author: Your Name
==========================================================
*/

import {

    getAllRecipes

} from "./api.js";

/*=========================================================
DOM Elements
=========================================================*/

const favoritesContainer =
    document.querySelector("#favoritesContainer");

const favoriteCount =
    document.querySelector("#favoriteCount");

const searchFavorites =
    document.querySelector("#favoriteSearch");

/*=========================================================
Application State
=========================================================*/

let favoriteRecipes = [];

let filteredFavorites = [];

/*=========================================================
Initialize
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initializeFavorites

);

function initializeFavorites() {

    loadFavorites();

    initializeEvents();

}

/*=========================================================
Load Favorites
=========================================================*/

function loadFavorites() {

    const favoriteIds = JSON.parse(

        localStorage.getItem("favoriteRecipes")

    ) || [];

    const allRecipes = getAllRecipes();

    favoriteRecipes = allRecipes.filter(recipe =>

        favoriteIds.includes(recipe.id)

    );

    filteredFavorites = [...favoriteRecipes];

    renderFavorites();

    updateFavoriteCount();

}

/*=========================================================
Render Favorites
=========================================================*/

function renderFavorites() {

    if (!favoritesContainer) return;

    if (filteredFavorites.length === 0) {

        favoritesContainer.innerHTML = emptyFavorites();

        return;

    }

    favoritesContainer.innerHTML = filteredFavorites

        .map(recipeCard)

        .join("");

}

/*=========================================================
Recipe Card
=========================================================*/

function recipeCard(recipe) {

    return `

<div class="recipe-card">

    <img

        src="${recipe.image}"

        alt="${recipe.title}"

        loading="lazy">

    <div class="recipe-content">

        <span class="category">

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

                ⭐ ${recipe.rating}

            </span>

            <span>

                ⏱ ${recipe.cookingTime}

            </span>

        </div>

        <div class="recipe-actions">

            <button

                class="view-btn" class="view-btn:hover"

                data-id="${recipe.id}">

                View Recipe

            </button>

            <button

                class="remove-btn"

                data-id="${recipe.id}">

                Remove

            </button>

        </div>

    </div>

</div>

`;

}

/*=========================================================
Favorite Count
=========================================================*/

function updateFavoriteCount() {

    if (!favoriteCount) return;

    favoriteCount.textContent =

        filteredFavorites.length;

}

/*=========================================================
Empty State
=========================================================*/

function emptyFavorites() {

    return `

<div class="empty-state">

    <img

        src="assets/images/empty-favorites.jpg" 

        alt="No Favorites" >

    <h2>

        No Favorite Recipes

    </h2>

    <p>

        Start adding recipes to your favorites.

    </p>

    <a

        href="index.html#recipes"

        class="btn">

        Browse Recipes

    </a>

</div>

`;

}
/*=========================================================
Search Favorites
=========================================================*/

function handleSearch(event) {

    const query = event.target.value

        .trim()

        .toLowerCase();

    if (!query) {

        filteredFavorites = [...favoriteRecipes];

    } else {

        filteredFavorites = favoriteRecipes.filter(recipe =>

            recipe.title.toLowerCase().includes(query) ||

            recipe.description.toLowerCase().includes(query) ||

            recipe.category.toLowerCase().includes(query) ||

            recipe.cuisine.toLowerCase().includes(query)

        );

    }

    renderFavorites();

    updateFavoriteCount();

}

/*=========================================================
Remove Favorite
=========================================================*/

function removeFavorite(recipeId) {

    let favorites = JSON.parse(

        localStorage.getItem("favoriteRecipes")

    ) || [];

    favorites = favorites.filter(

        id => id !== Number(recipeId)

    );

    localStorage.setItem(

        "favoriteRecipes",

        JSON.stringify(favorites)

    );

    showToast("🗑 Recipe removed from favorites");

    loadFavorites();

}

/*=========================================================
Clear All Favorites
=========================================================*/

function clearFavorites() {

    const confirmed = confirm(

        "Remove all favorite recipes?"

    );

    if (!confirmed) return;

    localStorage.removeItem(

        "favoriteRecipes"

    );

    favoriteRecipes = [];

    filteredFavorites = [];

    renderFavorites();

    updateFavoriteCount();

    showToast("🗑 Favorites cleared");

}

/*=========================================================
Recipe Actions
=========================================================*/

function handleRecipeActions(event) {

    const removeButton =

        event.target.closest(".remove-btn");

    if (removeButton) {

        removeFavorite(

            removeButton.dataset.id

        );

        return;

    }

    const viewButton =

        event.target.closest(".view-btn");

    if (viewButton) {

        window.location.href =

            `recipe.html?id=${viewButton.dataset.id}`;

    }

}

/*=========================================================
Toast Notification
=========================================================*/

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {

        toast.classList.add("show");

    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}

/*=========================================================
Utility
=========================================================*/

function debounce(callback, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/*=========================================================
Initialize Events
=========================================================*/

function initializeEvents() {

    if (searchFavorites) {

        searchFavorites.addEventListener(

            "input",

            debounce(handleSearch, 250)

        );

    }

    favoritesContainer?.addEventListener(

        "click",

        handleRecipeActions

    );

    document

        .querySelector("#clearFavorites")

        ?.addEventListener(

            "click",

            clearFavorites

        );

}