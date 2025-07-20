export class FilterModel {
    constructor() {
        this.filters = {
            search: '',
            pagesMin: null,
            pagesMax: null,
            author: '',
            hasAnnotation: ''
        };
    }

    setSearchFilter(query) {
        this.filters.search = query;
    }

    setPagesFilter(min, max) {
        this.filters.pagesMin = min;
        this.filters.pagesMax = max;
    }

    setAuthorFilter(author) {
        this.filters.author = author;
    }

    setAnnotationFilter(hasAnnotation) {
        this.filters.hasAnnotation = hasAnnotation;
    }

    getFilters() {
        return { ...this.filters };
    }

    clearFilters() {
        this.filters = {
            search: '',
            pagesMin: null,
            pagesMax: null,
            author: '',
            hasAnnotation: ''
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

    getUniqueAuthors(books) {
        const authors = books
            .map(book => book.author)
            .filter(author => author && author.trim())
            .map(author => author.trim());
        return [...new Set(authors)].sort();
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

        if (this.filters.author && this.filters.author.trim()) {
            filteredBooks = filteredBooks.filter(book =>
                book.author && book.author.toLowerCase().includes(this.filters.author.toLowerCase())
            );
        }

        if (this.filters.hasAnnotation && this.filters.hasAnnotation !== '') {
            filteredBooks = filteredBooks.filter(book => {
                const hasNote = book.annotation && book.annotation.note;
                const hasComment = book.annotation && book.annotation.commentaire;
                const hasAnyAnnotation = hasNote || hasComment;

                if (this.filters.hasAnnotation === 'with') {
                    return hasAnyAnnotation;
                } else if (this.filters.hasAnnotation === 'without') {
                    return !hasAnyAnnotation;
                }
                return true;
            });
        }

        return filteredBooks;
    }
}
