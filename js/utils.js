/*=========================================================
RecipeHub
utils.js
Shared Utility Functions
=========================================================*/

/*=========================================================
DOM Helpers
=========================================================*/

export function $(selector) {
    return document.querySelector(selector);
}

export function $$(selector) {
    return document.querySelectorAll(selector);
}

export function createElement(tag, className = "", content = "") {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (content) {
        element.textContent = content;
    }

    return element;
}

/*=========================================================
Local Storage
=========================================================*/

export function saveToStorage(key, value) {
    localStorage.setItem(
        key,
        JSON.stringify(value)
    );
}

export function loadFromStorage(key, defaultValue = []) {

    const data = localStorage.getItem(key);

    if (!data) {
        return defaultValue;
    }

    try {

        return JSON.parse(data);

    } catch {

        return defaultValue;

    }

}

export function removeFromStorage(key) {

    localStorage.removeItem(key);

}

export function clearStorage() {

    localStorage.clear();

}

/*=========================================================
Numbers
=========================================================*/

export function formatCookingTime(minutes) {

    if (minutes < 60) {

        return `${minutes} mins`;

    }

    const hours = Math.floor(minutes / 60);

    const remaining = minutes % 60;

    if (remaining === 0) {

        return `${hours} hr`;

    }

    return `${hours} hr ${remaining} mins`;

}

export function formatCalories(calories) {

    return `${calories} kcal`;

}

/*=========================================================
Rating
=========================================================*/

export function createStars(rating) {

    let stars = "";

    const fullStars = Math.floor(rating);

    const halfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {

        if (i <= fullStars) {

            stars += "★";

        }

        else if (i === fullStars + 1 && halfStar) {

            stars += "☆";

        }

        else {

            stars += "✩";

        }

    }

    return stars;

}

/*=========================================================
Strings
=========================================================*/

export function capitalize(text) {

    if (!text) return "";

    return text.charAt(0).toUpperCase() +

        text.slice(1);

}

export function slugify(text) {

    return text

        .toLowerCase()

        .trim()

        .replace(/\s+/g, "-")

        .replace(/[^\w-]/g, "");

}

/*=========================================================
Arrays
=========================================================*/

export function shuffleArray(array) {

    const shuffled = [...array];

    for (

        let i = shuffled.length - 1;

        i > 0;

        i--

    ) {

        const j = Math.floor(

            Math.random() * (i + 1)

        );

        [

            shuffled[i],

            shuffled[j]

        ] = [

            shuffled[j],

            shuffled[i]

        ];

    }

    return shuffled;

}

export function getRandomItems(array, count) {

    return shuffleArray(array)

        .slice(0, count);

}

/*=========================================================
Debounce
=========================================================*/

export function debounce(callback, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback(...args);

        }, delay);

    };

}

/*=========================================================
Throttle
=========================================================*/

export function throttle(callback, delay = 200) {

    let waiting = false;

    return (...args) => {

        if (waiting) return;

        callback(...args);

        waiting = true;

        setTimeout(() => {

            waiting = false;

        }, delay);

    };

}

/*=========================================================
Search Helper
=========================================================*/

export function normalize(text) {

    return text

        .toLowerCase()

        .trim();

}

/*=========================================================
Date
=========================================================*/

export function currentYear() {

    return new Date().getFullYear();

}
/*=========================================================
Toast Notification
=========================================================*/

export function showToast(message, duration = 2500) {

    const existingToast = document.querySelector(".toast");

    if (existingToast) {
        existingToast.remove();
    }

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

    }, duration);

}

/*=========================================================
Scroll To Top
=========================================================*/

export function scrollToTop() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/*=========================================================
Scroll To Element
=========================================================*/

export function scrollToElement(selector) {

    const element = document.querySelector(selector);

    if (!element) return;

    element.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}

/*=========================================================
Loading Spinner
=========================================================*/

export function showLoader(container) {

    if (!container) return;

    container.innerHTML = `

        <div class="recipe-loading">

            <div class="spinner"></div>

            <p>Loading recipes...</p>

        </div>

    `;

}

export function hideLoader(container) {

    if (!container) return;

    const loader = container.querySelector(".recipe-loading");

    if (loader) {

        loader.remove();

    }

}

/*=========================================================
Image Fallback
=========================================================*/

export function imageFallback(image) {

    image.onerror = () => {

        image.src = "assets/images/placeholders/recipe-placeholder.jpg";

    };

}

/*=========================================================
Clipboard
=========================================================*/

export async function copyToClipboard(text) {

    try {

        await navigator.clipboard.writeText(text);

        showToast("📋 Copied to clipboard");

    }

    catch {

        showToast("Unable to copy");

    }

}

/*=========================================================
Share
=========================================================*/

export async function sharePage(title, text) {

    if (navigator.share) {

        try {

            await navigator.share({

                title,

                text,

                url: window.location.href

            });

        }

        catch (error) {

            console.log(error);

        }

    }

    else {

        copyToClipboard(window.location.href);

    }

}

/*=========================================================
URL Parameters
=========================================================*/

export function getQueryParameter(parameter) {

    const params = new URLSearchParams(

        window.location.search

    );

    return params.get(parameter);

}

export function setQueryParameter(key, value) {

    const url = new URL(window.location);

    url.searchParams.set(key, value);

    window.history.replaceState({}, "", url);

}

/*=========================================================
Validation
=========================================================*/

export function isValidEmail(email) {

    const pattern =

        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);

}

export function isEmpty(value) {

    return value.trim() === "";

}

/*=========================================================
Render Empty State
=========================================================*/

export function renderEmptyState(container, message) {

    if (!container) return;

    container.innerHTML = `

        <div class="empty-state">

            <img src="assets/images/placeholders/empty.png"

            alt="No Data">

            <h2>${message}</h2>

            <p>Try searching for something else.</p>

        </div>

    `;

}

/*=========================================================
Random ID
=========================================================*/

export function generateId() {

    return Date.now().toString(36) +

        Math.random().toString(36).substring(2, 8);

}

/*=========================================================
Sleep
=========================================================*/

export function sleep(milliseconds) {

    return new Promise(resolve => {

        setTimeout(resolve, milliseconds);

    });

}

/*=========================================================
Console Banner
=========================================================*/

export function consoleBanner() {

    console.log(

        "%cRecipeHub",

        "color:white;background:#ff6b35;padding:8px 14px;border-radius:6px;font-size:16px;font-weight:bold;"

    );

    console.log(

        "Developed using HTML, CSS and JavaScript"

    );

}

/*=========================================================
Initialize Utilities
=========================================================*/

export function initializeUtilities() {

    consoleBanner();

    const yearElement = document.querySelector(

        "#currentYear"

    );

    if (yearElement) {

        yearElement.textContent =

            new Date().getFullYear();

    }

}
