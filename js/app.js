import { BookModel } from './models/BookModel.js';
import { ColumnModel } from './models/ColumnModel.js';
import { AnnotationModel } from './models/AnnotationModel.js';
import { FilterModel } from './models/FilterModel.js';
import { LibraryView } from './views/LibraryView.js';
import { ModalView } from './views/ModalView.js';
import { FilterView } from './views/FilterView.js';
import { LibraryController } from './controllers/LibraryController.js';
import { ColumnController } from './controllers/ColumnController.js';
import { DragDropController } from './controllers/DragDropController.js';
import { FilterController } from './controllers/FilterController.js';

class App {
  constructor() {
    this.bookModel = new BookModel();
    this.columnModel = new ColumnModel();
    this.annotationModel = new AnnotationModel();
    this.filterModel = new FilterModel();
    this.libraryView = new LibraryView();
    this.modalView = new ModalView();
    this.filterView = new FilterView();

    this.dragDropController = new DragDropController(
      this.bookModel,
      this.columnModel,
      this.modalView
    );

    this.filterController = new FilterController(
      this.filterModel,
      this.filterView
    );

    this.libraryController = new LibraryController(
      this.bookModel,
      this.columnModel,
      this.annotationModel,
      this.libraryView,
      this.modalView,
      this.dragDropController,
      this.filterController
    );

    this.columnController = new ColumnController(
      this.columnModel,
      this.bookModel,
      this.modalView
    );

    window.libraryController = this.libraryController;
  }

  async init() {
    this.libraryController.initEventListeners();
    this.columnController.initEventListeners();
    this.filterController.initEventListeners();
    await this.libraryController.init();
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const app = new App();
  await app.init();
});
