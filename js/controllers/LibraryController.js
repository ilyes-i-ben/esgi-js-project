export class LibraryController {
    constructor(bookModel, columnModel, annotationModel, libraryView, modalView, dragDropController, filterController) {
        this.bookModel = bookModel;
        this.columnModel = columnModel;
        this.annotationModel = annotationModel;
        this.libraryView = libraryView;
        this.modalView = modalView;
        this.dragDropController = dragDropController;
        this.filterController = filterController;


        this.filterController.setFilterChangeCallback((filters) => {
            this.renderLibraryWithFilters();
        });
    }

    async init() {
        this.libraryView.showLoader();
        this.initEventListeners();
        await this.renderLibrary();


        const allBooks = await this.bookModel.getAllBooks();
        this.filterController.initializeWithBooks(allBooks);

        this.libraryView.hideLoader();
    }

    async renderLibrary(filterQuery = "") {
        const columns = this.columnModel.getColumns();
        let books = await this.bookModel.getAllBooks();


        if (filterQuery) {
            books = await this.bookModel.searchBooks(filterQuery);
        }

        books = books.map(book => ({
            ...book,
            annotation: this.annotationModel.get(book.isbn)
        }));

        this.libraryView.renderLibrary(columns, books);
        this.setupBookCardHandlers();
        this.dragDropController.initialize();
    }

    async renderLibraryWithFilters() {
        const columns = this.columnModel.getColumns();
        let books = await this.bookModel.getAllBooks();


        books = books.map(book => ({
            ...book,
            annotation: this.annotationModel.get(book.isbn)
        }));


        const filteredBooks = this.filterController.filterBooks(books);

        this.libraryView.renderLibrary(columns, filteredBooks);
        this.setupBookCardHandlers();
        this.dragDropController.initialize();
    }

    setupBookCardHandlers() {
        const bookCards = document.querySelectorAll(".book-card");
        const columns = this.columnModel.getColumns();

        bookCards.forEach((card) => {
            card.addEventListener("click", () => {
                this.showBookDetails(card.dataset.bookIsbn);
            });

            const actionsDiv = card.querySelector(".book-actions");

            const detailsBtn = document.createElement("button");
            detailsBtn.className = "details-btn";
            detailsBtn.textContent = "Détails";
            detailsBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.showBookDetails(card.dataset.bookIsbn);
            });
            actionsDiv.appendChild(detailsBtn);

            const bookColumnId = card.closest('.column').dataset.columnId;
            columns.forEach((column) => {
                if (column.id !== bookColumnId) {
                    const moveBtn = document.createElement("button");
                    moveBtn.className = "move-btn";
                    moveBtn.textContent = `→ ${column.name}`;
                    moveBtn.style.backgroundColor = column.color;
                    moveBtn.addEventListener("click", async (e) => {
                        e.stopPropagation();
                        await this.moveBook(card.dataset.bookIsbn, column.id);
                    });
                    actionsDiv.appendChild(moveBtn);
                }
            });
        });
    }

    async showBookDetails(isbn) {
        const book = await this.bookModel.getBookByIsbn(isbn);
        if (!book) return;

        const columns = this.columnModel.getColumns();
        const annotation = this.annotationModel.get(isbn);

        this.modalView.showBookDetailModal(book, columns, annotation);
    }

    async moveBook(isbn, targetColumnId) {
        const book = await this.bookModel.getBookByIsbn(isbn);
        if (!book) return;

        await this.bookModel.moveBook(isbn, targetColumnId);
        const column = this.columnModel.getColumnById(targetColumnId);

        await this.renderLibraryWithFilters();
        this.modalView.showToast(`"${book.title}" déplacé vers ${column.name}`, "success");
    }

    async addBook(bookData) {
        const newBook = await this.bookModel.addBook(bookData);
        await this.renderLibraryWithFilters();
        this.modalView.showToast(`"${newBook.title}" ajouté`, "success");
        return newBook;
    }

    async deleteBook(isbn) {
        const book = await this.bookModel.getBookByIsbn(isbn);
        if (!book) return;

        const success = await this.bookModel.deleteBook(isbn);
        if (success) {
            this.annotationModel.delete(isbn);
            await this.renderLibraryWithFilters();
            this.modalView.showToast(`"${book.title}" supprimé`, "success");
            this.modalView.hideBookDetailModal();
        }
    }

    async searchBooks(query) {
        await this.renderLibrary(query);
    }

    initEventListeners() {
        document.getElementById("addBookBtn").addEventListener("click", () => {
            const columns = this.columnModel.getColumns();
            this.modalView.showAddBookModal(columns);
        });

        document.getElementById("closeAddBookModal").addEventListener("click", () => {
            this.modalView.hideAddBookModal();
        });

        document.getElementById("closeBookDetailModal").addEventListener("click", () => {
            this.modalView.hideBookDetailModal();
        });

        document.getElementById("addBookForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const bookData = {
                title: document.getElementById("bookTitle").value,
                author: document.getElementById("bookAuthor").value,
                subtitle: document.getElementById("bookSubtitle").value,
                published: document.getElementById("bookPublished").value,
                publisher: document.getElementById("bookPublisher").value,
                pages: document.getElementById("bookPages").value,
                description: document.getElementById("bookDescription").value,
                website: document.getElementById("bookWebsite").value,
                columnId: document.getElementById("bookColumn").value,
            };

            if (document.getElementById("bookIsbn").value) {
                bookData.isbn = document.getElementById("bookIsbn").value;
            }

            await this.addBook(bookData);
            this.modalView.hideAddBookModal();
        });


        window.addEventListener("click", (e) => {
            if (e.target === document.getElementById("addBookModal")) {
                this.modalView.hideAddBookModal();
            }
            if (e.target === document.getElementById("bookDetailModal")) {
                this.modalView.hideBookDetailModal();
            }
            if (e.target === document.getElementById("customizeModal")) {
                this.modalView.hideCustomizeModal();
            }
        });

        document.addEventListener("click", async (e) => {
            if (e.target.classList.contains("star") && e.target.dataset.isbn) {
                const rating = e.target.dataset.value;
                const isbn = e.target.dataset.isbn;
                this.updateStarDisplay(isbn, rating);
            }

            if (e.target.classList.contains("move-detail-btn")) {
                const columnId = e.target.dataset.columnId;
                const isbn = document.querySelector("#bookDetailContent").querySelector("[data-isbn]")?.dataset?.isbn;
                if (isbn) {
                    await this.moveBook(isbn, columnId);
                    this.modalView.hideBookDetailModal();
                }
            }

            if (e.target.classList.contains("delete-btn")) {
                const bookDetailContent = document.getElementById("bookDetailContent");
                if (bookDetailContent && bookDetailContent.contains(e.target)) {
                    const starContainer = document.getElementById("starContainer");
                    const isbn = starContainer?.querySelector("[data-isbn]")?.dataset.isbn;
                    if (isbn && confirm("Êtes-vous sûr de vouloir supprimer ce livre ?")) {
                        await this.deleteBook(isbn);
                    }
                }
            }
        });

        document.addEventListener("submit", async (e) => {
            if (e.target.id === "annotationForm") {
                e.preventDefault();
                const starContainer = document.getElementById("starContainer");
                const isbn = starContainer?.querySelector("[data-isbn]")?.dataset.isbn;
                const comment = document.getElementById("userCommentaire").value;
                const selectedStars = starContainer.querySelectorAll(".star");
                let rating = 0;

                selectedStars.forEach((star, index) => {
                    if (star.textContent === "★") rating = index + 1;
                });

                if (isbn) {
                    await this.saveAnnotation(isbn, rating, comment);
                    await this.showBookDetails(isbn);
                }
            }
        });
    }

    async saveAnnotation(isbn, note, commentaire) {
        const currentAnnotation = this.annotationModel.get(isbn);
        const finalNote = note !== null ? note : currentAnnotation.note;
        const finalComment = commentaire !== null ? commentaire : currentAnnotation.commentaire;

        const success = this.annotationModel.set(isbn, finalNote, finalComment);
        if (success) {
            await this.renderLibraryWithFilters();
            this.modalView.showToast("Annotation enregistrée", "success");
        }
    }

    updateStarDisplay(isbn, rating) {
        const stars = document.querySelectorAll(`[data-isbn="${isbn}"] .star`);
        stars.forEach((star, index) => {
            star.textContent = (index + 1) <= rating ? "★" : "☆";
            star.classList.toggle("active", (index + 1) <= rating);
        });

        const container = document.querySelector(`[data-isbn="${isbn}"]`);
        let ratingText = container.querySelector(".star-note-text");
        if (rating > 0) {
            if (!ratingText) {
                ratingText = document.createElement("span");
                ratingText.className = "star-note-text";
                container.appendChild(ratingText);
            }
            ratingText.textContent = `(${rating}/5)`;
        } else if (ratingText) {
            ratingText.remove();
        }
    }
}
