/*=========================================================
RecipeHub
filter.js
=========================================================*/

/*=========================================================
Filter State
=========================================================*/

const filterState = {

    category: "All",

    difficulty: "All",

    maxTime: null

};

/*=========================================================
Category Filter
=========================================================*/

export function initializeCategoryFilters(

    onFilterChange

) {

    const categoryButtons =

        document.querySelectorAll(

            ".category"

        );

    if (!categoryButtons.length) return;

    categoryButtons.forEach(button => {

        button.addEventListener(

            "click",

            () => {

                categoryButtons.forEach(btn => {

                    btn.classList.remove(

                        "active"

                    );

                });

                button.classList.add(

                    "active"

                );

                filterState.category =

                    button.textContent.trim();

                onFilterChange(

                    getFilterState()

                );

            }

        );

    });

}

/*=========================================================
Difficulty Filter
=========================================================*/

export function initializeDifficultyFilter(

    onFilterChange

) {

    const difficultySelect =

        document.querySelector(

            "#difficultyFilter"

        );

    if (!difficultySelect) return;

    difficultySelect.addEventListener(

        "change",

        event => {

            filterState.difficulty =

                event.target.value;

            onFilterChange(

                getFilterState()

            );

        }

    );

}

/*=========================================================
Time Filter
=========================================================*/

export function initializeTimeFilter(

    onFilterChange

) {

    const timeSelect =

        document.querySelector(

            "#timeFilter"

        );

    if (!timeSelect) return;

    timeSelect.addEventListener(

        "change",

        event => {

            const value =

                event.target.value;

            filterState.maxTime =

                value === ""

                    ? null

                    : Number(value);

            onFilterChange(

                getFilterState()

            );

        }

    );

}

/*=========================================================
Apply Filters
=========================================================*/

export function applyFilters(

    recipes,

    filters

) {

    return recipes.filter(recipe => {

        const categoryMatch =

            filters.category === "All"

            ||

            recipe.category ===

            filters.category;

        const difficultyMatch =

            filters.difficulty === "All"

            ||

            recipe.difficulty ===

            filters.difficulty;

        const timeMatch =

            filters.maxTime === null

            ||

            recipe.cookingTime <=

            filters.maxTime;

        return (

            categoryMatch &&

            difficultyMatch &&

            timeMatch

        );

    });

}

/*=========================================================
Get Filter State
=========================================================*/

export function getFilterState() {

    return {

        ...filterState

    };

}

/*=========================================================
Reset Filters
=========================================================*/

export function initializeResetFilters(

    onFilterChange

) {

    const resetButton =

        document.querySelector(

            "#resetFilters"

        );

    if (!resetButton) return;

    resetButton.addEventListener(

        "click",

        () => {

            filterState.category = "All";

            filterState.difficulty = "All";

            filterState.maxTime = null;

            document

                .querySelectorAll(".category")

                .forEach(button => {

                    button.classList.remove(

                        "active"

                    );

                });

            const allButton =

                document.querySelector(

                    ".category"

                );

            allButton?.classList.add(

                "active"

            );

            const difficultySelect =

                document.querySelector(

                    "#difficultyFilter"

                );

            if (difficultySelect) {

                difficultySelect.value =

                    "All";

            }

            const timeSelect =

                document.querySelector(

                    "#timeFilter"

                );

            if (timeSelect) {

                timeSelect.value = "";

            }

            updateFilterSummary();

            onFilterChange(

                getFilterState()

            );

        }

    );

}

/*=========================================================
Filter Summary
=========================================================*/

export function updateFilterSummary() {

    const summary =

        document.querySelector(

            "#filterSummary"

        );

    if (!summary) return;

    const activeFilters = [];

    if (

        filterState.category !== "All"

    ) {

        activeFilters.push(

            `Category: ${filterState.category}`

        );

    }

    if (

        filterState.difficulty !== "All"

    ) {

        activeFilters.push(

            `Difficulty: ${filterState.difficulty}`

        );

    }

    if (

        filterState.maxTime !== null

    ) {

        activeFilters.push(

            `Under ${filterState.maxTime} mins`

        );

    }

    summary.textContent =

        activeFilters.length

            ? activeFilters.join(" | ")

            : "No active filters";

}

/*=========================================================
Filtered Count
=========================================================*/

export function updateFilteredCount(

    count

) {

    const countElement =

        document.querySelector(

            "#recipeCount"

        );

    if (!countElement) return;

    countElement.textContent =

        `${count} Recipes`;

}

/*=========================================================
Save Filters
=========================================================*/

export function saveFilters() {

    localStorage.setItem(

        "recipeFilters",

        JSON.stringify(

            filterState

        )

    );

}

/*=========================================================
Load Filters
=========================================================*/

export function loadFilters() {

    const saved =

        localStorage.getItem(

            "recipeFilters"

        );

    if (!saved) return;

    try {

        const filters =

            JSON.parse(saved);

        filterState.category =

            filters.category ||

            "All";

        filterState.difficulty =

            filters.difficulty ||

            "All";

        filterState.maxTime =

            filters.maxTime ??

            null;

    }

    catch (error) {

        console.error(error);

    }

}

/*=========================================================
Initialize Filter UI
=========================================================*/

export function initializeFilterUI() {

    updateFilterSummary();

}

/*=========================================================
Master Initializer
=========================================================*/

export function initializeFilters(

    onFilterChange

) {

    loadFilters();

    initializeCategoryFilters(

        onFilterChange

    );

    initializeDifficultyFilter(

        onFilterChange

    );

    initializeTimeFilter(

        onFilterChange

    );

    initializeResetFilters(

        onFilterChange

    );

    initializeFilterUI();

}