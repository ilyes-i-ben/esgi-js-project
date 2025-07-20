export class DragDropController {
    constructor(bookModel, columnModel, modalView) {
        this.bookModel = bookModel;
        this.columnModel = columnModel;
        this.modalView = modalView;
    }

    initialize() {
        const bookCards = document.querySelectorAll(".book-card");
        const dropZones = document.querySelectorAll(".column-content");

        bookCards.forEach((card) => {
            card.addEventListener("dragstart", this.handleDragStart.bind(this));
            card.addEventListener("dragend", this.handleDragEnd.bind(this));
        });

        dropZones.forEach((zone) => {
            zone.addEventListener("dragover", this.handleDragOver.bind(this));
            zone.addEventListener("dragenter", this.handleDragEnter.bind(this));
            zone.addEventListener("dragleave", this.handleDragLeave.bind(this));
            zone.addEventListener("drop", this.handleDrop.bind(this));
        });
    }

    handleDragStart(e) {
        e.dataTransfer.setData("text/plain", e.target.dataset.bookIsbn);
        e.target.classList.add("dragging");
    }

    handleDragEnd(e) {
        e.target.classList.remove("dragging");
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.currentTarget.classList.add("drop-zone");
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove("drop-zone");
    }

    async handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove("drop-zone");

        const bookIsbn = e.dataTransfer.getData("text/plain");
        const targetColumnId = e.currentTarget.dataset.columnId;

        const book = await this.bookModel.getBookByIsbn(bookIsbn);

        if (book && book.columnId !== targetColumnId) {
            await this.bookModel.moveBook(bookIsbn, targetColumnId);

            // Trigger library re-render
            const searchInput = document.getElementById("searchInput");
            await window.libraryController.renderLibrary(searchInput.value);

            const column = this.columnModel.getColumnById(targetColumnId);
            this.modalView.showToast(`"${book.title}" déplacé vers ${column.name}`, "success");
        }
    }
}
