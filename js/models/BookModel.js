export class BookModel {
    constructor() {
        this.books = [];
        this.initialBooksLoaded = false;
    }

    async loadInitialBooksIfNeeded() {
        if (this.initialBooksLoaded) return;

        try {
            const response = await fetch("https://keligmartin.github.io/api/books.json");
            if (!response.ok) throw new Error("network response was not ok");
            const initialBooks = await response.json();

            const books = localStorage.getItem("library-books");
            if (!books) {
                const fixed = initialBooks.map((book) => ({
                    ...book,
                    columnId: book.columnId || "col-1",
                }));
                this.saveBooks(fixed);
                this.books = fixed;
            }
            this.initialBooksLoaded = true;
        } catch (error) {
            console.error("failed to fetch initial books:", error);
            this.initialBooksLoaded = true;
        }
    }

    async getAllBooks() {
        await this.loadInitialBooksIfNeeded();
        const books = localStorage.getItem("library-books");
        if (books) {
            this.books = JSON.parse(books);
            return this.books;
        }
        return [];
    }

    async getBooksByColumn(columnId) {
        const books = await this.getAllBooks();
        return books.filter((book) => book.columnId === columnId);
    }

    async getBookByIsbn(isbn) {
        const books = await this.getAllBooks();
        return books.find((book) => book.isbn === isbn);
    }

    async addBook(bookData) {
        const books = await this.getAllBooks();
        const isbn = bookData.isbn || "isbn-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
        const newBook = {
            ...bookData,
            isbn,
            columnId: bookData.columnId || "col-1",
        };
        books.push(newBook);
        this.saveBooks(books);
        return newBook;
    }

    async updateBook(isbn, updates) {
        const books = await this.getAllBooks();
        const index = books.findIndex((book) => book.isbn === isbn);
        if (index !== -1) {
            books[index] = { ...books[index], ...updates };
            this.saveBooks(books);
            return books[index];
        }
        return null;
    }

    async deleteBook(isbn) {
        const books = await this.getAllBooks();
        const filteredBooks = books.filter((book) => book.isbn !== isbn);
        if (filteredBooks.length < books.length) {
            this.saveBooks(filteredBooks);
            return true;
        }
        return false;
    }

    async moveBook(isbn, targetColumnId) {
        return await this.updateBook(isbn, { columnId: targetColumnId });
    }

    async searchBooks(query) {
        const books = await this.getAllBooks();
        if (!query) return books;
        query = query.toLowerCase();
        return books.filter(
            (book) =>
                (book.title && book.title.toLowerCase().includes(query)) ||
                (book.author && book.author.toLowerCase().includes(query)) ||
                (book.subtitle && book.subtitle.toLowerCase().includes(query))
        );
    }

    saveBooks(books) {
        localStorage.setItem("library-books", JSON.stringify(books));
        this.books = books;
    }
}
