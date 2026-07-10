/*
==========================================================
RecipeHub
Recipe Details Page

Author: Your Name
==========================================================
*/

import {

    getRecipeById,
    getRelatedRecipes

} from "./api.js";

/*=========================================================
DOM Elements
=========================================================*/

const recipeDetails =
    document.querySelector("#recipeDetails");

const relatedRecipes =
    document.querySelector("#relatedRecipes");

/*=========================================================
Initialize
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadRecipe();

});

/*=========================================================
Load Recipe
=========================================================*/

function loadRecipe() {

    const params = new URLSearchParams(window.location.search);

    const recipeId = params.get("id");

    if (!recipeId) {

        showError();

        return;

    }

    const recipe = getRecipeById(recipeId);

    if (!recipe) {

        showError();

        return;

    }

    renderRecipe(recipe);

    renderRelated(recipe.id);

    initializeRecipeEvents(recipe.id);

}

/*=========================================================
Render Recipe
=========================================================*/

function renderRecipe(recipe) {

    recipeDetails.innerHTML = `

<section class="recipe-hero">

    <div class="recipe-image">

        <img
            src="${recipe.image}"
            alt="${recipe.title}">

    </div>

    <div class="recipe-info">

        <span class="recipe-category">

            ${recipe.category}

        </span>

        <h1>

            ${recipe.title}

        </h1>

        <p>

            ${recipe.description}

        </p>

        <div class="recipe-meta">

            <span>⭐ ${recipe.rating}</span>

            <span>(${recipe.reviews} Reviews)</span>

            <span>⏱ ${recipe.cookingTime}</span>

            <span>👨‍🍳 ${recipe.difficulty}</span>

            <span>🍽 ${recipe.servings} Servings</span>

        </div>

        <div class="recipe-actions">

            <button class="favorite-btn"
            data-id="${recipe.id}">🤍 Add to Favorites</button>

            <button class="share-btn">📤 Share</button>

            <button class="print-btn">🖨 Print</button>

        </div>
    </div>

</section>

<section class="ingredients">

<h2>Ingredients</h2>

<ul>

${recipe.ingredients.map(item=>`

<li>${item}</li>

`).join("")}

</ul>

</section>

<section class="instructions">

<h2>Instructions</h2>

<ol>

${recipe.instructions.map(step=>`

<li>${step}</li>

`).join("")}

</ol>

</section>

<section class="nutrition">

<h2>Nutrition Facts</h2>

<div class="nutrition-grid">

<div>

<strong>Calories</strong>

<p>${recipe.nutrition.calories}</p>

</div>

<div>

<strong>Protein</strong>

<p>${recipe.nutrition.protein}</p>

</div>

<div>

<strong>Carbs</strong>

<p>${recipe.nutrition.carbs}</p>

</div>

<div>

<strong>Fat</strong>

<p>${recipe.nutrition.fat}</p>

</div>

<div>

<strong>Fiber</strong>

<p>${recipe.nutrition.fiber}</p>

</div>

</div>

</section>

`;

}

/*=========================================================
Related Recipes
=========================================================*/

function renderRelated(recipeId) {

    if (!relatedRecipes) return;

    const related = getRelatedRecipes(recipeId);

    relatedRecipes.innerHTML = related.map(recipe => `

<div class="related-card">

    <img
        src="${recipe.image}"
        alt="${recipe.title}">

    <h3>${recipe.title}</h3>

    <p>${recipe.cookingTime}</p>

    <a href="recipe.html?id=${recipe.id}">

        View Recipe →

    </a>

</div>

`).join("");

}

/*=========================================================
Error Page
=========================================================*/

function showError() {

    recipeDetails.innerHTML = `

<div class="error-page">

<h1>Recipe Not Found</h1>

<p>

The requested recipe does not exist.

</p>

<a href="index.html#recipes">

Back to Recipes

</a>

</div>

`;

}

/*=========================================================
Favorites
=========================================================*/

function toggleFavorite(recipeId) {

    const favorites = JSON.parse(

        localStorage.getItem("favoriteRecipes")

    ) || [];

    const index = favorites.indexOf(Number(recipeId));

    if (index === -1) {

        favorites.push(Number(recipeId));

        showToast("❤️ Added to Favorites");

    } else {

        favorites.splice(index, 1);

        showToast("🗑 Removed from Favorites");

    }

    localStorage.setItem(

        "favoriteRecipes",

        JSON.stringify(favorites)

    );

    updateFavoriteButton(recipeId);

}

/*=========================================================
Update Favorite Button
=========================================================*/

function updateFavoriteButton(recipeId) {

    const button = document.querySelector(".favorite-btn");

    if (!button) return;

    const favorites = JSON.parse(

        localStorage.getItem("favoriteRecipes")

    ) || [];

    if (favorites.includes(Number(recipeId))) {

        button.innerHTML = "❤️ Remove Favorite";

        button.classList.add("active");

    } else {

        button.innerHTML = "🤍 Add to Favorites";

        button.classList.remove("active");

    }

}

/*=========================================================
Recently Viewed
=========================================================*/

function saveRecentlyViewed(recipeId) {

    let recent = JSON.parse(

        localStorage.getItem("recentRecipes")

    ) || [];

    recent = recent.filter(id => id !== Number(recipeId));

    recent.unshift(Number(recipeId));

    recent = recent.slice(0, 8);

    localStorage.setItem(

        "recentRecipes",

        JSON.stringify(recent)

    );

}

/*=========================================================
Share Recipe
=========================================================*/

async function shareRecipe() {

    if (navigator.share) {

        try {

            await navigator.share({

                title: document.title,

                text: "Check out this delicious recipe!",

                url: window.location.href

            });

        } catch (error) {

            console.log(error);

        }

    } else {

        navigator.clipboard.writeText(

            window.location.href

        );

        showToast("🔗 Recipe link copied!");

    }

}

/*=========================================================
Print Recipe
=========================================================*/

function printRecipe() {

    window.print();

}

/*=========================================================
Toast
=========================================================*/

function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 2500);

}

/*=========================================================
Scroll To Top
=========================================================*/

function createScrollButton() {

    const button = document.createElement("button");

    button.className = "scroll-top";

    button.innerHTML = "↑";

    document.body.appendChild(button);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            button.classList.add("show");

        } else {

            button.classList.remove("show");

        }

    });

    button.addEventListener("click", () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}

/*=========================================================
Fade Animation
=========================================================*/

function animatePage() {

    document.querySelectorAll("section").forEach(section => {

        section.animate(

            [

                {

                    opacity: 0,

                    transform: "translateY(30px)"

                },

                {

                    opacity: 1,

                    transform: "translateY(0)"

                }

            ],

            {

                duration: 700,

                easing: "ease"

            }

        );

    });

}

/*=========================================================
Events
=========================================================*/

function initializeRecipeEvents(recipeId) {

    const favoriteButton =

        document.querySelector(".favorite-btn");

    if (favoriteButton) {

        favoriteButton.addEventListener("click", () =>

            toggleFavorite(recipeId)

        );

    }

    const shareButton =

        document.querySelector(".share-btn");

    if (shareButton) {

        shareButton.addEventListener(

            "click",

            shareRecipe

        );

    }

    const printButton =

        document.querySelector(".print-btn");

    if (printButton) {

        printButton.addEventListener(

            "click",

            printRecipe

        );

    }

    updateFavoriteButton(recipeId);

    saveRecentlyViewed(recipeId);

    createScrollButton();

    animatePage();

}