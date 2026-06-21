(() => {
    "use strict";

    const grid = document.getElementById("listings-grid");
    if (!grid) return;

    const searchForm = document.getElementById("listing-search-form");
    const searchInput = document.getElementById("listing-search-input");
    const filterButtons = document.querySelectorAll(".filter[data-filter]");
    const noResults = document.getElementById("no-listings-message");
    const items = Array.from(grid.querySelectorAll(".listing-item"));

    let activeCategory = null;

    const categoryKeywords = {
        trending: ["luxury", "paradise", "beachfront", "penthouse", "villa", "retreat", "exclusive"],
        rooms: ["room", "loft", "apartment", "cottage", "condo", "bungalow", "penthouse", "house", "brownstone"],
        "iconic-cities": ["city", "downtown", "urban", "york", "tokyo", "miami", "boston", "amsterdam", "dubai", "charleston", "florence", "montreal"],
        mountains: ["mountain", "aspen", "banff", "montana", "tahoe", "chalet", "ski", "alps", "highlands", "rockies"],
        castles: ["castle", "historic", "villa", "fort", "manor"],
        pools: ["pool", "beach", "beachfront", "paradise", "maldives", "cancun", "swim", "ocean", "shore"],
        camping: ["camp", "treehouse", "secluded", "forest", "campsite", "outdoor"],
        farms: ["farm", "ranch", "countryside", "cotswolds", "rural"],
        arctic: ["arctic", "snow", "ski", "swiss", "winter", "cold", "ice"],
        domes: ["dome", "treehouse", "igloo", "eco", "unique"],
        boats: ["boat", "ship", "island", "lake", "water", "overwater", "fiji", "maldives"],
    };

    function getSearchText(item) {
        return `${item.dataset.title || ""} ${item.dataset.location || ""}`.toLowerCase();
    }

    function getCategoryText(item) {
        return `${item.dataset.title || ""} ${item.dataset.location || ""} ${item.dataset.description || ""} ${item.dataset.country || ""}`.toLowerCase();
    }

    function matchesSearch(item, query) {
        if (!query) return true;
        return getSearchText(item).includes(query.toLowerCase().trim());
    }

    function matchesCategory(item, category) {
        if (!category) return true;
        const itemCategory = item.dataset.category;
        if (itemCategory) {
            return itemCategory === category;
        }
        const keywords = categoryKeywords[category];
        if (!keywords) return true;
        const text = getCategoryText(item);
        return keywords.some((word) => text.includes(word));
    }

    function applyFilters() {
        const query = searchInput ? searchInput.value : "";
        const hasFilter = query.trim() !== "" || activeCategory !== null;

        let matchCount = 0;
        let firstMatch = null;

        items.forEach((item) => {
            const isMatch =
                matchesSearch(item, query) &&
                matchesCategory(item, activeCategory);

            item.classList.remove("listing-match", "listing-blurred");

            if (!hasFilter) {
                return;
            }

            if (isMatch) {
                item.classList.add("listing-match");
                matchCount++;
                if (!firstMatch) firstMatch = item;
            } else {
                item.classList.add("listing-blurred");
            }
        });

        grid.classList.toggle("listings-filter-active", hasFilter);

        if (noResults) {
            noResults.hidden = !hasFilter || matchCount > 0;
        }

        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    function setActiveFilter(category) {
        filterButtons.forEach((btn) => {
            btn.classList.toggle("filter-active", btn.dataset.filter === category);
        });
    }

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const category = btn.dataset.filter;
            activeCategory = activeCategory === category ? null : category;
            setActiveFilter(activeCategory);
            applyFilters();
        });

        btn.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                btn.click();
            }
        });
    });

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            applyFilters();
        });

        searchInput.addEventListener("input", applyFilters);
    }
})();
