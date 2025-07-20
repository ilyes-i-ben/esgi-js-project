export class AnnotationModel {
    constructor() {
        this.storageKey = "library-annotations";
    }

    getAll() {
        return JSON.parse(localStorage.getItem(this.storageKey) || "{}");
    }

    get(isbn) {
        const annotations = this.getAll();
        return annotations[isbn] || { note: "", commentaire: "" };
    }

    set(isbn, note, commentaire) {
        try {
            const data = this.getAll();
            data[isbn] = {
                note: note || "",
                commentaire: commentaire || "",
            };
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error("Error saving annotation:", error);
            return false;
        }
    }

    delete(isbn) {
        try {
            const data = this.getAll();
            delete data[isbn];
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error("Error deleting annotation:", error);
            return false;
        }
    }
}
