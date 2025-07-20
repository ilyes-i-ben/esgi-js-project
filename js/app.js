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
import { ErrorHandler } from './utils/ErrorHandler.js';

class App {
  constructor() {
    this.bookModel = new BookModel();
    this.columnModel = new ColumnModel();
    this.annotationModel = new AnnotationModel();
    this.filterModel = new FilterModel();
    this.libraryView = new LibraryView();
    this.modalView = new ModalView();
    this.filterView = new FilterView();

    this.errorHandler = new ErrorHandler(this.modalView);

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
    window.errorHandler = this.errorHandler;
  }

  async init() {
    try {
      this.libraryController.initEventListeners();
      this.columnController.initEventListeners();
      this.filterController.initEventListeners();
      await this.libraryController.init();
    } catch (error) {
      this.errorHandler.handleError(error, 'Erreur d\'initialisation');
    }
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const app = new App();
    await app.init();
  } catch (error) {
    console.error('Critical initialization error:', error);

    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = 'Erreur critique lors du chargement de l\'application';
      toast.className = 'toast show error';
      setTimeout(() => {
        toast.className = 'toast';
      }, 5000);
    }
  }
});
