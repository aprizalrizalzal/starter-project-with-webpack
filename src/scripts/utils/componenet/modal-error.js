export default function modalError(message) {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");
    overlay.id = "error-overlay";

    const errorPopup = document.createElement("div");
    errorPopup.classList.add("modal-popup");
    errorPopup.id = "error-popup";

    const errorMessage = document.createElement("p");
    errorMessage.classList.add("error-message");
    errorMessage.id = "error-message";
    errorMessage.textContent = `Error. ${message}.`;

    const closeButton = document.createElement("a");
    closeButton.textContent = "Tutup";
    closeButton.classList.add("button");
    closeButton.id = "close-button";

    closeButton.addEventListener("click", () => {
        document.body.removeChild(errorPopup);
        document.body.removeChild(overlay);
    });

    errorPopup.appendChild(errorMessage);
    errorPopup.appendChild(closeButton);

    document.body.appendChild(overlay);
    document.body.appendChild(errorPopup);
}