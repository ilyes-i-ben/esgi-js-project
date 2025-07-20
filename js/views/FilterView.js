export class FilterView {
    constructor() {
        this.searchInput = document.getElementById("searchInput");
        this.filterContainer = null;
        this.createFilterContainer();
    }

    createFilterContainer() {

        const searchContainer = document.querySelector(".search-container");

        this.filterContainer = document.createElement("div");
        this.filterContainer.className = "filter-container";
        this.filterContainer.innerHTML = `
      <div class="filter-section">
        <div class="filter-group">
          <label>Nombre de pages:</label>
          <div class="range-filter">
            <div class="range-inputs">
              <input type="number" id="pagesMin" placeholder="Min" min="0">
              <span>-</span>
              <input type="number" id="pagesMax" placeholder="Max" min="0">
            </div>
            <div class="range-slider">
              <input type="range" id="rangeMin" min="0" max="1000" value="0">
              <input type="range" id="rangeMax" min="0" max="1000" value="1000">
            </div>
            <div class="range-values">
              <span id="rangeMinValue">0</span>
              <span id="rangeMaxValue">1000</span>
            </div>
          </div>
        </div>
        <div class="filter-actions">
          <button id="clearFiltersBtn" class="btn secondary">
            <i class="fas fa-times"></i> Effacer
          </button>
        </div>
      </div>
    `;


        searchContainer.parentNode.insertBefore(this.filterContainer, searchContainer.nextSibling);
    }

    initializePageRange(min, max) {
        const rangeMin = document.getElementById("rangeMin");
        const rangeMax = document.getElementById("rangeMax");
        const pagesMin = document.getElementById("pagesMin");
        const pagesMax = document.getElementById("pagesMax");
        const rangeMinValue = document.getElementById("rangeMinValue");
        const rangeMaxValue = document.getElementById("rangeMaxValue");


        rangeMin.min = min;
        rangeMin.max = max;
        rangeMin.value = min;
        rangeMax.min = min;
        rangeMax.max = max;
        rangeMax.value = max;


        pagesMin.min = min;
        pagesMin.max = max;
        pagesMin.placeholder = `Min (${min})`;
        pagesMax.min = min;
        pagesMax.max = max;
        pagesMax.placeholder = `Max (${max})`;


        rangeMinValue.textContent = min;
        rangeMaxValue.textContent = max;
    }

    updateRangeDisplay(min, max) {
        document.getElementById("rangeMinValue").textContent = min;
        document.getElementById("rangeMaxValue").textContent = max;
    }

    getSearchQuery() {
        return this.searchInput.value.trim();
    }

    getPagesFilter() {
        const pagesMin = document.getElementById("pagesMin");
        const pagesMax = document.getElementById("pagesMax");

        return {
            min: pagesMin.value ? parseInt(pagesMin.value) : null,
            max: pagesMax.value ? parseInt(pagesMax.value) : null
        };
    }

    clearAllFilters() {
        this.searchInput.value = '';
        document.getElementById("pagesMin").value = '';
        document.getElementById("pagesMax").value = '';

        const rangeMin = document.getElementById("rangeMin");
        const rangeMax = document.getElementById("rangeMax");
        rangeMin.value = rangeMin.min;
        rangeMax.value = rangeMax.max;

        this.updateRangeDisplay(rangeMin.min, rangeMax.max);
    }

    syncRangeWithInputs() {
        const pagesMin = document.getElementById("pagesMin");
        const pagesMax = document.getElementById("pagesMax");
        const rangeMin = document.getElementById("rangeMin");
        const rangeMax = document.getElementById("rangeMax");

        if (pagesMin.value) {
            rangeMin.value = pagesMin.value;
        }
        if (pagesMax.value) {
            rangeMax.value = pagesMax.value;
        }

        this.updateRangeDisplay(rangeMin.value, rangeMax.value);
    }

    syncInputsWithRange() {
        const pagesMin = document.getElementById("pagesMin");
        const pagesMax = document.getElementById("pagesMax");
        const rangeMin = document.getElementById("rangeMin");
        const rangeMax = document.getElementById("rangeMax");


        if (parseInt(rangeMin.value) > parseInt(rangeMax.value)) {
            rangeMin.value = rangeMax.value;
        }
        if (parseInt(rangeMax.value) < parseInt(rangeMin.value)) {
            rangeMax.value = rangeMin.value;
        }

        pagesMin.value = rangeMin.value !== rangeMin.min ? rangeMin.value : '';
        pagesMax.value = rangeMax.value !== rangeMax.max ? rangeMax.value : '';

        this.updateRangeDisplay(rangeMin.value, rangeMax.value);
    }
}
