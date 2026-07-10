/*=========================================================
RecipeHub
animations.js
=========================================================*/

import {

    throttle,
    scrollToTop

} from "./utils.js";

/*=========================================================
DOM Elements
=========================================================*/

const navbar = document.querySelector(".navbar");

const menuButton = document.querySelector(".menu-btn") || document.querySelector(".menu-toggle");;

const navLinks = document.querySelector(".nav-links");

/*=========================================================
Sticky Navbar
=========================================================*/

export function initializeStickyNavbar() {

    if (!navbar) return;

    const handleScroll = throttle(() => {

        if (window.scrollY > 80) {

            navbar.classList.add("sticky");

        }

        else {

            navbar.classList.remove("sticky");

        }

    }, 100);

    window.addEventListener(

        "scroll",

        handleScroll

    );

}

/*=========================================================
Mobile Navigation
=========================================================*/

export function initializeMobileMenu() {

    if (!menuButton || !navLinks) return;

    menuButton.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        menuButton.classList.toggle("active");

    });

    navLinks.querySelectorAll("a")

        .forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("active");

                menuButton.classList.remove("active");

            });

        });

}

/*=========================================================
Smooth Scroll
=========================================================*/

export function initializeSmoothScroll() {

    document

        .querySelectorAll('a[href^="#"]')

        .forEach(link => {

            link.addEventListener(

                "click",

                event => {

                    const targetId =

                        link.getAttribute("href");

                    if (

                        targetId === "#" ||

                        targetId.length === 1

                    ) {

                        return;

                    }

                    const target =

                        document.querySelector(targetId);

                    if (!target) return;

                    event.preventDefault();

                    target.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

                }

            );

        });

}

/*=========================================================
Scroll To Top Button
=========================================================*/

export function initializeScrollButton() {

    let button =

        document.querySelector(".scroll-top");

    if (!button) {

        button = document.createElement("button");

        button.className = "scroll-top";

        button.innerHTML = "↑";

        document.body.appendChild(button);

    }

    window.addEventListener(

        "scroll",

        throttle(() => {

            if (window.scrollY > 400) {

                button.classList.add("show");

            }

            else {

                button.classList.remove("show");

            }

        }, 100)

    );

    button.addEventListener(

        "click",

        scrollToTop

    );

}

/*=========================================================
Fade Sections
=========================================================*/

export function initializeRevealAnimation() {

    const sections =

        document.querySelectorAll(

            "section"

        );

    const observer =

        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(

                            "fade-in"

                        );

                    }

                });

            },

            {

                threshold: 0.15

            }

        );

    sections.forEach(section => {

        observer.observe(section);

    });

}
/*=========================================================
Hero Animation
=========================================================*/

export function initializeHeroAnimation() {

    const heroContent =

        document.querySelector(".hero-content");

    if (!heroContent) return;

    heroContent.animate(

        [
            {
                opacity: 0,
                transform: "translateY(40px)"
            },
            {
                opacity: 1,
                transform: "translateY(0)"
            }
        ],

        {
            duration: 1000,
            easing: "ease-out",
            fill: "forwards"
        }

    );

}

/*=========================================================
Recipe Card Hover Effects
=========================================================*/

export function initializeCardAnimations() {

    const cards =

        document.querySelectorAll(".recipe-card");

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.style.transform =

                "translateY(-8px)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform =

                "translateY(0)";

        });

    });

}

/*=========================================================
Lazy Images
=========================================================*/

export function initializeLazyImages() {

    const images =

        document.querySelectorAll("img[data-src]");

    if (!images.length) return;

    const observer =

        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const image = entry.target;

                    image.src = image.dataset.src;

                    image.removeAttribute("data-src");

                    observer.unobserve(image);

                });

            },

            {
                threshold: 0.1
            }

        );

    images.forEach(image => {

        observer.observe(image);

    });

}

/*=========================================================
Counter Animation
=========================================================*/

export function animateCounter(

    element,

    target,

    duration = 1500

) {

    if (!element) return;

    let start = 0;

    const increment =

        target / (duration / 16);

    function update() {

        start += increment;

        if (start >= target) {

            element.textContent = target;

            return;

        }

        element.textContent =

            Math.floor(start);

        requestAnimationFrame(update);

    }

    update();

}

/*=========================================================
Statistics Counters
=========================================================*/

export function initializeCounters() {

    const counters =

        document.querySelectorAll(

            "[data-counter]"

        );

    if (!counters.length) return;

    const observer =

        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)

                        return;

                    const target = Number(

                        entry.target.dataset.counter

                    );

                    animateCounter(

                        entry.target,

                        target

                    );

                    observer.unobserve(

                        entry.target

                    );

                });

            },

            {
                threshold: 0.5
            }

        );

    counters.forEach(counter => {

        observer.observe(counter);

    });

}

/*=========================================================
Loading Fade Out
=========================================================*/

export function hidePageLoader() {

    const loader =

        document.querySelector(".page-loader");

    if (!loader) return;

    window.addEventListener("load", () => {

        loader.classList.add("hide");

        setTimeout(() => {

            loader.remove();

        }, 500);

    });

}

/*=========================================================
Page Transition
=========================================================*/

export function initializePageTransitions() {

    document

        .querySelectorAll("a")

        .forEach(link => {

            const href =

                link.getAttribute("href");

            if (

                !href ||

                href.startsWith("#") ||

                href.startsWith("http")

            ) {

                return;

            }

            link.addEventListener(

                "click",

                event => {

                    event.preventDefault();

                    document.body.classList.add(

                        "page-transition"

                    );

                    setTimeout(() => {

                        window.location.href = href;

                    }, 250);

                }

            );

        });

}

/*=========================================================
Master Animation Initializer
=========================================================*/

export function initializeAnimations() {

    initializeHeroAnimation();

    initializeCardAnimations();

    initializeLazyImages();

    initializeCounters();

    initializePageTransitions();

    hidePageLoader();

}