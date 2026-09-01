(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
        return;
    }

    document.documentElement.classList.add("motion-enabled");

    const revealElements = document.querySelectorAll(
        ".section-header, .project-card, .project-section-header, " +
        ".project-section-text, .image-grid figure, .full-image"
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");

        if (element.matches(".image-grid figure, .full-image")) {
            element.classList.add("reveal-image");
        }
    });

    document.querySelectorAll(".project-card").forEach((card, index) => {
        card.style.setProperty("--reveal-delay", `${index * 80}ms`);
    });

    document.querySelectorAll(".image-grid").forEach((grid) => {
        grid.querySelectorAll("figure").forEach((figure, index) => {
            figure.style.setProperty("--reveal-delay", `${index * 90}ms`);
        });
    });

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -8% 0px"
        });

        revealElements.forEach((element) => revealObserver.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add("is-visible"));
    }

    const parallaxFigures = document.querySelectorAll(".full-image[data-parallax]");

    if (!parallaxFigures.length) {
        return;
    }

    let parallaxFrame;

    const updateParallax = () => {
        const viewportHeight = window.innerHeight;

        parallaxFigures.forEach((figure) => {
            const bounds = figure.getBoundingClientRect();

            if (bounds.bottom < 0 || bounds.top > viewportHeight) {
                return;
            }

            const figureCenter = bounds.top + bounds.height / 2;
            const viewportCenter = viewportHeight / 2;
            const progress = (figureCenter - viewportCenter) /
                ((viewportHeight + bounds.height) / 2);
            const offset = Math.max(-1, Math.min(1, progress)) * -8;

            figure.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
        });

        parallaxFrame = undefined;
    };

    const requestParallaxUpdate = () => {
        if (parallaxFrame) {
            return;
        }

        parallaxFrame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);
})();
