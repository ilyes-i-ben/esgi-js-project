export class ErrorHandler {
    constructor(modalView) {
        this.modalView = modalView;
        this.setupGlobalErrorHandlers();
    }

    setupGlobalErrorHandlers() {
        window.addEventListener('error', (event) => {
            this.handleError(event.error || event.message, 'Erreur JavaScript');
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Erreur de promesse');
            event.preventDefault();
        });
    }

    handleError(error, category = 'Erreur') {
        let message = this.formatErrorMessage(error, category);

        this.modalView.showToast(message, 'error');

        if (this.isDevelopment()) {
            console.error(`[${category}]`, error);
        }
    }

    formatErrorMessage(error, category) {
        const userFriendlyMessages = {
            'NetworkError': 'Problème de connexion réseau',
            'TypeError': 'Erreur de données',
            'ReferenceError': 'Erreur de référence',
            'SyntaxError': 'Erreur de syntaxe',
            'failed to fetch': 'Impossible de charger les données',
            'network response was not ok': 'Erreur de chargement des données'
        };

        let message = '';

        if (typeof error === 'string') {
            message = error;
        } else if (error && error.message) {
            message = error.message;
        } else {
            message = 'Une erreur inattendue s\'est produite';
        }

        for (const [technical, friendly] of Object.entries(userFriendlyMessages)) {
            if (message.toLowerCase().includes(technical.toLowerCase())) {
                return friendly;
            }
        }

        if (this.isDevelopment()) {
            return `${category}: ${message}`;
        }

        return 'Une erreur s\'est produite. Veuillez réessayer.';
    }

    isDevelopment() {
        return window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1' ||
            window.location.hostname === '';
    }

    reportError(message, type = 'error') {
        this.modalView.showToast(message, type);
    }
}
