export class FilterModel {
    constructor() {
        this.filters = {
            search: '',
            pagesMin: null,
            pagesMax: null
        };
    }

    setSearchFilter(query) {
        this.filters.search = query;
    }

    setPagesFilter(min, max) {
        this.filters.pagesMin = min;
        this.filters.pagesMax = max;
    }

    getFilters() {
        return { ...this.filters };
    }

    clearFilters() {
        this.filters = {
            search: '',
            pagesMin: null,
            pagesMax: null
        };
    }

    getPageRange(books) {
        const booksWithPages = books.filter(book => book.pages && !isNaN(book.pages));

        if (booksWithPages.length === 0) {
            return { min: 0, max: 1000 };
        }

        const pages = booksWithPages.map(book => parseInt(book.pages));
        return {
            min: Math.min(...pages),
            max: Math.max(...pages)
        };
    }

    applyFilters(books) {
        let filteredBooks = [...books];


        if (this.filters.search && this.filters.search.trim()) {
            const query = this.filters.search.toLowerCase();
            filteredBooks = filteredBooks.filter(book =>
                (book.title && book.title.toLowerCase().includes(query)) ||
                (book.author && book.author.toLowerCase().includes(query)) ||
                (book.subtitle && book.subtitle.toLowerCase().includes(query))
            );
        }


        if (this.filters.pagesMin !== null || this.filters.pagesMax !== null) {
            filteredBooks = filteredBooks.filter(book => {
                const bookPages = parseInt(book.pages) || 0;

                if (this.filters.pagesMin !== null && bookPages < this.filters.pagesMin) {
                    return false;
                }

                if (this.filters.pagesMax !== null && bookPages > this.filters.pagesMax) {
                    return false;
                }

                return true;
            });
        }

        return filteredBooks;
    }
}
