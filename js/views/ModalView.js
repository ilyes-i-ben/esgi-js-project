export class ModalView {
    constructor() {
        this.addBookModal = document.getElementById("addBookModal");
        this.bookDetailModal = document.getElementById("bookDetailModal");
        this.customizeModal = document.getElementById("customizeModal");
        this.bookDetailContent = document.getElementById("bookDetailContent");
        this.columnsContainer = document.getElementById("columnsContainer");
    }

    showAddBookModal(columns) {
        this.populateColumnSelect(columns);
        this.addBookModal.style.display = "block";
    }

    hideAddBookModal() {
        this.addBookModal.style.display = "none";
        document.getElementById("addBookForm").reset();

        // Clear ISBN validation
        const isbnValidationMessage = document.getElementById("isbnValidation");
        if (isbnValidationMessage) {
            isbnValidationMessage.style.display = "none";
            isbnValidationMessage.textContent = "";
        }

        const isbnInput = document.getElementById("bookIsbn");
        if (isbnInput) {
            isbnInput.classList.remove("valid", "invalid");
        }

        // Clear URL validation
        const urlValidationMessage = document.getElementById("urlValidation");
        if (urlValidationMessage) {
            urlValidationMessage.style.display = "none";
            urlValidationMessage.textContent = "";
        }

        const urlInput = document.getElementById("bookWebsite");
        if (urlInput) {
            urlInput.classList.remove("valid", "invalid");
        }
    }

    showBookDetailModal(book, columns, annotation) {
        const currentColumn = columns.find((col) => col.id === book.columnId);
        //TODO: move to a html file instead.
        this.bookDetailContent.innerHTML = `
      <div class="book-detail">
        <div class="detail-info">
          <h2 class="detail-title">${book.title}</h2>
          <div class="detail-author">par ${book.author}</div>
          ${book.subtitle ? `<div class="detail-subtitle">${book.subtitle}</div>` : ""}
          ${book.published ? `<div class="detail-year">Publié en ${new Date(book.published).getFullYear()}</div>` : ""}
          ${book.publisher ? `<div class="detail-publisher">Éditeur : ${book.publisher}</div>` : ""}
          ${book.pages ? `<div class="detail-pages">${book.pages} pages</div>` : ""}
          <div class="detail-column">Colonne actuelle : <strong>${currentColumn.name}</strong></div>
          <div class="detail-actions">
            ${columns.map(column =>
            column.id !== book.columnId
                ? `<button class="btn move-detail-btn" data-column-id="${column.id}" style="background-color:${column.color}">Déplacer vers ${column.name}</button>`
                : ""
        ).join("")}
            <button class="btn delete-btn" style="background-color:#e74c3c">Supprimer</button>
          </div>
        </div>
        <div class="detail-description" style="margin-top:1em;">
          <h3>Description :</h3>
          <p>${book.description || "Pas de description."}</p>
          ${book.website ? `<a href="${book.website}" target="_blank" class="website-link">Plus d'infos</a>` : ""}
        </div>
        <div class="annotation-section">
          <h4>Votre évaluation</h4>
          <form id="annotationForm">
            <div class="annotation-form-group">
              <label for="userNote">Note :</label>
              <div class="rating-container">
                <span class="rating-label">Ma note :</span>
                <span id="starContainer"></span>
              </div>
            </div>
            <div class="annotation-form-group">
              <label for="userCommentaire">Commentaire :</label>
              <div class="comment-container">
                <textarea 
                  id="userCommentaire" 
                  class="comment-textarea"
                  placeholder="Partagez votre avis sur ce livre..."
                  rows="4">${annotation.commentaire || ""}</textarea>
              </div>
            </div>
            <button type="submit" class="annotation-save-btn">
              💾 Enregistrer mon avis
            </button>
          </form>
          
          ${annotation.note || annotation.commentaire
                ? `<div class="annotation-display">
                <h5>Mon avis enregistré</h5>
                ${annotation.note
                    ? `<div class="saved-rating">
                      <strong>Note :</strong> 
                      ${this.getStarRatingHtml(annotation.note, false)}
                    </div>`
                    : ""
                }
                ${annotation.commentaire
                    ? `<div class="saved-comment">"${annotation.commentaire}"</div>`
                    : ""
                }
              </div>`
                : `<div class="no-annotation">
                <p>💭 Aucun avis enregistré pour ce livre</p>
              </div>`
            }
        </div>
      </div>
    `;

        const starContainer = document.getElementById("starContainer");
        starContainer.innerHTML = this.generateInteractiveStarRating(annotation.note || 0, book.isbn);

        this.bookDetailModal.style.display = "block";
    }

    hideBookDetailModal() {
        this.bookDetailModal.style.display = "none";
    }

    showCustomizeModal(columns) {
        this.renderColumnCustomizer(columns);
        this.customizeModal.style.display = "block";
    }

    hideCustomizeModal() {
        this.customizeModal.style.display = "none";
    }

    populateColumnSelect(columns) {
        const select = document.getElementById("bookColumn");
        select.innerHTML = "";
        columns.forEach((column) => {
            const option = document.createElement("option");
            option.value = column.id;
            option.textContent = column.name;
            select.appendChild(option);
        });
    }

    renderColumnCustomizer(columns) {
        this.columnsContainer.innerHTML = "";
        columns.forEach((column) => {
            const columnItem = document.createElement("div");
            columnItem.className = "column-item";
            columnItem.innerHTML = `
        <input type="text" class="column-name" value="${column.name}" data-column-id="${column.id}">
        <input type="color" class="color-picker" value="${column.color}" data-column-id="${column.id}">
        ${columns.length > 1
                    ? `<button class="btn delete-btn" data-column-id="${column.id}">Suppr.</button>`
                    : ""
                }
      `;
            this.columnsContainer.appendChild(columnItem);
        });
    }

    generateStarRating(currentRating, isbn) {
        let html = "";
        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= (Number(currentRating) || 0);
            html += `<span class="star" data-value="${i}" data-isbn="${isbn}">${isFilled ? "★" : "☆"}</span>`;
        }
        if (currentRating > 0) {
            html += `<span class="star-note-text">(${currentRating}/5)</span>`;
        }
        return html;
    }

    generateInteractiveStarRating(currentRating, isbn) {
        return this.getStarRatingHtml(currentRating || 0, true, isbn);
    }

    getStarRatingHtml(note, interactive, currentId) {
        const rating = Number(note) || 0;
        let html = '<div class="star-rating' + (interactive ? " interactive" : "") + '"';
        if (interactive && currentId) html += ` data-isbn="${currentId}"`;
        html += ">";

        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= rating;
            if (interactive && currentId) {
                html += `<span class="star" data-value="${i}" data-isbn="${currentId}">${isFilled ? "★" : "☆"}</span>`;
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

    showToast(message, type = "info") {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.className = "toast show " + type;
        setTimeout(() => {
            toast.className = "toast";
        }, 2200);
    }
}
