export class FormValidator {
    constructor() {
        this.validators = new Map();
        this.setupISBNValidator();
    }

    setupISBNValidator() {
        const isbnInput = document.getElementById("bookIsbn");
        if (!isbnInput) return;

        const validationMessage = document.createElement("div");
        validationMessage.className = "validation-message";
        validationMessage.id = "isbnValidation";
        isbnInput.parentNode.appendChild(validationMessage);

        isbnInput.addEventListener("input", (e) => {
            this.validateISBN(e.target.value, validationMessage);
        });

        isbnInput.addEventListener("blur", (e) => {
            this.validateISBN(e.target.value, validationMessage);
        });
    }

    validateISBN(value, messageElement) {
        const isbnInput = document.getElementById("bookIsbn");

        if (!value || value.trim() === "") {
            this.clearValidation(messageElement);
            isbnInput.classList.remove("valid", "invalid");
            return true;
        }

        const isbnRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/;
        const isValid = isbnRegex.test(value.trim());

        if (isValid) {
            this.showValidation(messageElement, "✓ ISBN valide", "valid");
            isbnInput.classList.remove("invalid");
            isbnInput.classList.add("valid");
        } else {
            this.showValidation(messageElement, "✗ ISBN invalide - Format attendu: 978-2-123456-78-9 ou 2-123456-78-9", "invalid");
            isbnInput.classList.remove("valid");
            isbnInput.classList.add("invalid");
        }

        return isValid;
    }

    showValidation(element, message, type) {
        element.textContent = message;
        element.className = `validation-message ${type}`;
        element.style.display = "block";
    }

    clearValidation(element) {
        element.textContent = "";
        element.style.display = "none";
        element.className = "validation-message";
    }

    validateForm() {
        const isbnInput = document.getElementById("bookIsbn");
        const isbnValue = isbnInput?.value || "";

        if (isbnValue.trim() !== "") {
            return this.validateISBN(isbnValue, document.getElementById("isbnValidation"));
        }

        return true;
    }
}
