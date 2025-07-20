export class FilterController {
    constructor(filterModel, filterView) {
        this.filterModel = filterModel;
        this.filterView = filterView;
        this.onFilterChange = null;
    }

    setFilterChangeCallback(callback) {
        this.onFilterChange = callback;
    }

    initEventListeners() {
        const searchInput = this.filterView.searchInput;
        const searchBtn = document.getElementById("searchBtn");

        searchBtn.addEventListener("click", () => {
            this.applyFilters();
        });

        searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                this.applyFilters();
            }
        });

        const pagesMin = document.getElementById("pagesMin");
        const pagesMax = document.getElementById("pagesMax");
        const rangeMin = document.getElementById("rangeMin");
        const rangeMax = document.getElementById("rangeMax");

        pagesMin.addEventListener("input", () => {
            this.filterView.syncRangeWithInputs();
            this.applyFilters();
        });

        pagesMax.addEventListener("input", () => {
            this.filterView.syncRangeWithInputs();
            this.applyFilters();
        });

        rangeMin.addEventListener("input", () => {
            this.filterView.syncInputsWithRange();
            this.applyFilters();
        });

        rangeMax.addEventListener("input", () => {
            this.filterView.syncInputsWithRange();
            this.applyFilters();
        });

        // new filterrr event listeners...
        document.getElementById("authorFilter").addEventListener("change", () => {
            this.applyFilters();
        });

        document.getElementById("annotationFilter").addEventListener("change", () => {
            this.applyFilters();
        });

        document.getElementById("clearFiltersBtn").addEventListener("click", () => {
            this.clearAllFilters();
        });
    }

    initializeWithBooks(books) {
        const pageRange = this.filterModel.getPageRange(books);
        this.filterView.initializePageRange(pageRange.min, pageRange.max);

        const authors = this.filterModel.getUniqueAuthors(books);
        this.filterView.populateAuthors(authors);
    }

    applyFilters() {
        const searchQuery = this.filterView.getSearchQuery();
        const pagesFilter = this.filterView.getPagesFilter();
        const authorFilter = this.filterView.getAuthorFilter();
        const annotationFilter = this.filterView.getAnnotationFilter();

        this.filterModel.setSearchFilter(searchQuery);
        this.filterModel.setPagesFilter(pagesFilter.min, pagesFilter.max);
        this.filterModel.setAuthorFilter(authorFilter);
        this.filterModel.setAnnotationFilter(annotationFilter);

        if (this.onFilterChange) {
            this.onFilterChange(this.filterModel.getFilters());
        }
    }

    clearAllFilters() {
        this.filterModel.clearFilters();
        this.filterView.clearAllFilters();

        if (this.onFilterChange) {
            this.onFilterChange(this.filterModel.getFilters());
        }
    }

    filterBooks(books) {
        return this.filterModel.applyFilters(books);
    }
}
