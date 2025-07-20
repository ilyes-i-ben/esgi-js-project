// Import MVC components
import { BookModel } from './models/BookModel.js';
import { ColumnModel } from './models/ColumnModel.js';
import { AnnotationModel } from './models/AnnotationModel.js';
import { LibraryView } from './views/LibraryView.js';
import { ModalView } from './views/ModalView.js';
import { LibraryController } from './controllers/LibraryController.js';
import { ColumnController } from './controllers/ColumnController.js';
import { DragDropController } from './controllers/DragDropController.js';

class App {
  constructor() {
    this.bookModel = new BookModel();
    this.columnModel = new ColumnModel();
    this.annotationModel = new AnnotationModel();
    this.libraryView = new LibraryView();
    this.modalView = new ModalView();

    this.dragDropController = new DragDropController(
      this.bookModel,
      this.columnModel,
      this.modalView
    );

    this.libraryController = new LibraryController(
      this.bookModel,
      this.columnModel,
      this.annotationModel,
      this.libraryView,
      this.modalView,
      this.dragDropController
    );

    this.columnController = new ColumnController(
      this.columnModel,
      this.bookModel,
      this.modalView
    );

    // Make libraryController globally accessible for drag & drop
    window.libraryController = this.libraryController;
  }

  async init() {
    this.libraryController.initEventListeners();
    this.columnController.initEventListeners();
    await this.libraryController.init();
  }
}

// Initialize the app when DOM is loaded
window.addEventListener("DOMContentLoaded", async () => {
  const app = new App();
  await app.init();
});
