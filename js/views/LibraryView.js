export class LibraryView {
    constructor() {
        this.libraryContainer = document.getElementById("libraryContainer");
    }

    renderLibrary(columns, books) {
        this.libraryContainer.innerHTML = "";

        columns.forEach((column) => {
            const columnBooks = books.filter((book) => book.columnId === column.id);
            this.renderColumn(column, columnBooks);
        });
    }

    renderColumn(column, books) {
        const columnEl = document.createElement("div");
        columnEl.className = "column";
        columnEl.id = column.id;
        columnEl.dataset.columnId = column.id;

        const headerEl = document.createElement("div");
        headerEl.className = "column-header";
        headerEl.style.backgroundColor = column.color;
        headerEl.innerHTML = `<h3>${column.name}</h3><span class="column-count">${books.length}</span>`;

        const contentEl = document.createElement("div");
        contentEl.className = "column-content";
        contentEl.dataset.columnId = column.id;

        books.forEach((book) => {
            const card = this.createBookCard(book);
            contentEl.appendChild(card);
        });

        columnEl.appendChild(headerEl);
        columnEl.appendChild(contentEl);
        this.libraryContainer.appendChild(columnEl);
    }

    createBookCard(book) {
        const bookEl = document.createElement("div");
        bookEl.className = "book-card";
        bookEl.dataset.bookIsbn = book.isbn;
        bookEl.draggable = true;

        const infoDiv = document.createElement("div");
        infoDiv.className = "book-info";

        const titleEl = document.createElement("div");
        titleEl.className = "book-title";
        titleEl.textContent = book.title;

        const authorEl = document.createElement("div");
        authorEl.className = "book-author";
        authorEl.textContent = book.author;

        infoDiv.appendChild(titleEl);
        infoDiv.appendChild(authorEl);

        //Add annotation if exists
        if (book.annotation && (book.annotation.note || book.annotation.commentaire)) {
            const annotationDiv = this.createAnnotationElement(book.annotation);
            infoDiv.appendChild(annotationDiv);
        }

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "book-actions";
        infoDiv.appendChild(actionsDiv);

        bookEl.appendChild(infoDiv);
        return bookEl;
    }

    createAnnotationElement(annotation) {
        const annotationDiv = document.createElement("div");
        annotationDiv.className = "book-card-annotation";

        if (annotation.note) {
            const ratingDiv = document.createElement("div");
            ratingDiv.className = "book-card-rating";
            ratingDiv.innerHTML = this.getStarRatingHtml(annotation.note, false);
            annotationDiv.appendChild(ratingDiv);
        }

        if (annotation.commentaire) {
            const commentDiv = document.createElement("div");
            commentDiv.className = "book-card-comment";
            commentDiv.textContent = annotation.commentaire;
            annotationDiv.appendChild(commentDiv);
        }

        return annotationDiv;
    }

    getStarRatingHtml(note, interactive, currentId) {
        const rating = Number(note) || 0;
        let html = '<div class="star-rating' + (interactive ? " interactive" : "") + '"';
        if (interactive && currentId) html += ` data-isbn="${currentId}"`;
        html += ">";

        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= rating;
            if (interactive && currentId) {
                html += `<span class="star" data-value="${i}" data-isbn="${currentId}">${isFilled ? "★" : "☆"
                    }</span>`;
            } else {
                html += `<span class="star">${isFilled ? "★" : "☆"}</span>`;
            }
        }

        if (rating > 0) {
            html += `<span class="star-note-text">(${rating}/5)</span>`;
        }

        html += "</div>";
        return html;
    }

    showLoader() {
        const loader = document.getElementById("loader");
        loader.style.display = "flex";
    }

    hideLoader() {
        const loader = document.getElementById("loader");
        loader.style.display = "none";
    }
}
