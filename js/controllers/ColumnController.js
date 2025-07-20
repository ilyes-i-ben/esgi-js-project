export class ColumnController {
    constructor(columnModel, bookModel, modalView) {
        this.columnModel = columnModel;
        this.bookModel = bookModel;
        this.modalView = modalView;
    }

    initEventListeners() {
        document.getElementById("customizeBtn").addEventListener("click", () => {
            const columns = this.columnModel.getColumns();
            this.modalView.showCustomizeModal(columns);
        });

        document.getElementById("closeCustomizeModal").addEventListener("click", () => {
            this.modalView.hideCustomizeModal();
        });

        document.getElementById("addColumnBtn").addEventListener("click", () => {
            this.addColumn();
        });

        document.getElementById("saveCustomizeBtn").addEventListener("click", () => {
            this.saveColumnCustomizations();
        });

        document.addEventListener("click", (e) => {
            if (e.target.classList.contains("delete-btn")) {
                const columnId = e.target.dataset.columnId;
                this.deleteColumn(columnId);
            }
        });
    }

    addColumn() {
        const newColumn = this.columnModel.addColumn();
        const columns = this.columnModel.getColumns();
        this.modalView.renderColumnCustomizer(columns);
    }

    async deleteColumn(columnId) {
        const result = this.columnModel.deleteColumn(columnId);

        if (!result.success) {
            this.modalView.showToast(result.message, "error");
            return;
        }

        const books = await this.bookModel.getAllBooks();
        const booksToMove = books.filter(book => book.columnId === columnId);

        for (const book of booksToMove) {
            await this.bookModel.moveBook(book.isbn, result.alternativeColumn.id);
        }

        const columns = this.columnModel.getColumns();
        this.modalView.renderColumnCustomizer(columns);
        this.modalView.showToast("Colonne supprimée", "success");
    }

    async saveColumnCustomizations() {
        const columns = this.columnModel.getColumns();

        document.querySelectorAll(".column-name").forEach((input) => {
            const columnId = input.dataset.columnId;
            this.columnModel.updateColumn(columnId, { name: input.value });
        });

        document.querySelectorAll(".color-picker").forEach((input) => {
            const columnId = input.dataset.columnId;
            this.columnModel.updateColumn(columnId, { color: input.value });
        });

        this.modalView.hideCustomizeModal();
        this.modalView.showToast("Personnalisation enregistrée", "success");


        window.libraryController.renderLibraryWithFilters();
    }
}
