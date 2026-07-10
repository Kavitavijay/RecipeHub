/*=========================================================
RecipeHub
search.js
=========================================================*/

import {

    debounce,
    normalize,
    renderEmptyState

} from "./utils.js";

/*=========================================================
Search State
=========================================================*/

let currentSearch = "";

/*=========================================================
Search Input
=========================================================*/

const searchInput =

    document.querySelector(

        "#searchInput"

    );

/*=========================================================
Search Recipes
=========================================================*/

export function searchRecipes(

    recipes,

    query

) {

    if (!query) {

        return recipes;

    }

    const keyword =

        normalize(query);

    return recipes.filter(recipe => {

        const titleMatch =

            normalize(recipe.title)

            .includes(keyword);

        const categoryMatch =

            normalize(recipe.category)

            .includes(keyword);

        const difficultyMatch =

            normalize(recipe.difficulty)

            .includes(keyword);

        const ingredientMatch =

            recipe.ingredients.some(

                ingredient =>

                    normalize(ingredient)

                    .includes(keyword)

            );

        const tagMatch =

            recipe.tags.some(

                tag =>

                    normalize(tag)

                    .includes(keyword)

            );

        return (

            titleMatch ||

            categoryMatch ||

            difficultyMatch ||

            ingredientMatch ||

            tagMatch

        );

    });

}

/*=========================================================
Search History
=========================================================*/

export function getSearchHistory() {

    return JSON.parse(

        localStorage.getItem(

            "searchHistory"

        )

    ) || [];

}

export function saveSearchHistory(

    query

) {

    if (!query) return;

    let history =

        getSearchHistory();

    history = history.filter(

        item => item !== query

    );

    history.unshift(query);

    history = history.slice(0, 10);

    localStorage.setItem(

        "searchHistory",

        JSON.stringify(history)

    );

}

/*=========================================================
Get Current Search
=========================================================*/

export function getCurrentSearch() {

    return currentSearch;

}

/*=========================================================
Set Current Search
=========================================================*/

export function setCurrentSearch(

    query

) {

    currentSearch = query;

}

/*=========================================================
Clear Search
=========================================================*/

export function clearSearch() {

    currentSearch = "";

    if (searchInput) {

        searchInput.value = "";

    }

}

/*=========================================================
Search Handler
=========================================================*/

export function initializeSearch(

    recipes,

    renderFunction,

    updateCount

) {

    if (!searchInput) return;

    searchInput.addEventListener(

        "input",

        debounce(event => {

            const query =

                event.target.value

                .trim();

            currentSearch = query;

            saveSearchHistory(query);

            const results =

                searchRecipes(

                    recipes,

                    query

                );

            if (

                results.length === 0

            ) {

                renderEmptyState(

                    document.querySelector(

                        "#recipeContainer"

                    ),

                    "No recipes found"

                );

                updateCount(0);

                return;

            }

            renderFunction(

                results

            );

            updateCount(

                results.length

            );

        }, 300)

    );

}

/*=========================================================
Search Suggestions
=========================================================*/

let selectedSuggestionIndex = -1;

export function createSuggestions(

    recipes,

    query

) {

    if (!query) return [];

    const keyword =

        normalize(query);

    return recipes

        .filter(recipe =>

            normalize(recipe.title)

            .includes(keyword)

        )

        .slice(0, 5);

}

/*=========================================================
Render Suggestions
=========================================================*/

export function renderSuggestions(

    recipes,

    query

) {

    const container =

        document.querySelector(

            "#searchSuggestions"

        );

    if (!container) return;

    const suggestions =

        createSuggestions(

            recipes,

            query

        );

    if (!suggestions.length) {

        container.innerHTML = "";

        return;

    }

    container.innerHTML = suggestions

        .map(recipe => `

            <div
                class="suggestion-item"
                data-title="${recipe.title}">

                ${recipe.title}

            </div>

        `)

        .join("");

}

/*=========================================================
Suggestion Click
=========================================================*/

export function initializeSuggestions() {

    const container =

        document.querySelector(

            "#searchSuggestions"

        );

    if (!container) return;

    container.addEventListener(

        "click",

        event => {

            const item =

                event.target.closest(

                    ".suggestion-item"

                );

            if (!item) return;

            const title =

                item.dataset.title;

            searchInput.value = title;

            currentSearch = title;

            container.innerHTML = "";

            searchInput.dispatchEvent(

                new Event("input")

            );

        }

    );

}

/*=========================================================
Clear Search Button
=========================================================*/

export function initializeClearSearch() {

    const clearButton =

        document.querySelector(

            "#clearSearch"

        );

    if (!clearButton) return;

    clearButton.addEventListener(

        "click",

        () => {

            clearSearch();

            searchInput.dispatchEvent(

                new Event("input")

            );

        }

    );

}

/*=========================================================
Keyboard Navigation
=========================================================*/

export function initializeKeyboardNavigation() {

    const container =

        document.querySelector(

            "#searchSuggestions"

        );

    if (!container) return;

    searchInput?.addEventListener(

        "keydown",

        event => {

            const items =

                container.querySelectorAll(

                    ".suggestion-item"

                );

            if (!items.length) return;

            if (

                event.key === "ArrowDown"

            ) {

                event.preventDefault();

                selectedSuggestionIndex++;

            }

            if (

                event.key === "ArrowUp"

            ) {

                event.preventDefault();

                selectedSuggestionIndex--;

            }

            if (

                selectedSuggestionIndex < 0

            ) {

                selectedSuggestionIndex =

                    items.length - 1;

            }

            if (

                selectedSuggestionIndex >=

                items.length

            ) {

                selectedSuggestionIndex = 0;

            }

            items.forEach(item =>

                item.classList.remove(

                    "active"

                )

            );

            items[

                selectedSuggestionIndex

            ]?.classList.add(

                "active"

            );

            if (

                event.key === "Enter"

            ) {

                items[

                    selectedSuggestionIndex

                ]?.click();

            }

        }

    );

}

/*=========================================================
Recent Searches
=========================================================*/

export function renderSearchHistory() {

    const historyContainer =

        document.querySelector(

            "#searchHistory"

        );

    if (!historyContainer) return;

    const history =

        getSearchHistory();

    historyContainer.innerHTML =

        history.map(item => `

            <button
                class="history-item">

                ${item}

            </button>

        `).join("");

}

/*=========================================================
Search History Events
=========================================================*/

export function initializeSearchHistory() {

    const historyContainer =

        document.querySelector(

            "#searchHistory"

        );

    if (!historyContainer) return;

    historyContainer.addEventListener(

        "click",

        event => {

            const button =

                event.target.closest(

                    ".history-item"

                );

            if (!button) return;

            const value =

                button.textContent.trim();

            searchInput.value = value;

            searchInput.dispatchEvent(

                new Event("input")

            );

        }

    );

}

/*=========================================================
Master Initializer
=========================================================*/

export function initializeSearchFeatures(

    recipes

) {

    initializeSuggestions();

    initializeClearSearch();

    initializeKeyboardNavigation();

    initializeSearchHistory();

    renderSearchHistory();

    searchInput?.addEventListener(

        "input",

        event => {

            renderSuggestions(

                recipes,

                event.target.value

            );

        }

    );

}