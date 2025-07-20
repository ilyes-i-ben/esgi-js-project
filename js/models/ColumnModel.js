export class ColumnModel {
    constructor() {
        this.defaultColumns = [
            { id: "col-1", name: "À lire", color: "#3498db" },
            { id: "col-2", name: "En cours", color: "#f39c12" },
            { id: "col-3", name: "Terminés", color: "#2ecc71" },
        ];
    }

    getColumns() {
        const columns = localStorage.getItem("library-columns");
        return columns ? JSON.parse(columns) : this.defaultColumns;
    }

    saveColumns(columns) {
        localStorage.setItem("library-columns", JSON.stringify(columns));
    }

    getColumnById(columnId) {
        const columns = this.getColumns();
        return columns.find(col => col.id === columnId);
    }

    addColumn(name, color) {
        const columns = this.getColumns();
        const newColumn = {
            id: "col-" + Date.now(),
            name: name || "Nouvelle colonne",
            color: color || this.getRandomColor(),
        };
        columns.push(newColumn);
        this.saveColumns(columns);
        return newColumn;
    }

    updateColumn(columnId, updates) {
        const columns = this.getColumns();
        const index = columns.findIndex(col => col.id === columnId);
        if (index !== -1) {
            columns[index] = { ...columns[index], ...updates };
            this.saveColumns(columns);
            return columns[index];
        }
        return null;
    }

    deleteColumn(columnId) {
        const columns = this.getColumns();
        if (columns.length <= 1) {
            return { success: false, message: "Vous ne pouvez pas supprimer la dernière colonne" };
        }

        const filteredColumns = columns.filter(col => col.id !== columnId);
        this.saveColumns(filteredColumns);

        //Return the alternative column for moving books
        const altColumn = filteredColumns[0];
        return { success: true, alternativeColumn: altColumn };
    }

    getRandomColor() {
        const colors = [
            "#3498db", "#2ecc71", "#f39c12", "#9b59b6",
            "#1abc9c", "#e74c3c", "#34495e", "#16a085",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
