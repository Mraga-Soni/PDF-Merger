const form = document.getElementById("pdfForm");
const loader = document.getElementById("loader");
const darkToggle = document.getElementById("darkToggle");
const fileInput = document.getElementById("pdfInput");

// DARK MODE
const updateDarkModeUI = (isDark) => {
    document.body.classList.toggle("dark", isDark);
    darkToggle.innerHTML = isDark ? "☀️" : "🌙";
};

darkToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark");
    updateDarkModeUI(isDark);
    localStorage.setItem("darkMode", isDark);
});

// Restore on load
if (localStorage.getItem("darkMode") === "true") {
    updateDarkModeUI(true);
}

// ERROR HANDLING
function showError(msg) {
    const alertBox = document.getElementById("error-alert");
    const errorText = document.getElementById("error-text");
    if (alertBox && errorText) {
        errorText.textContent = msg;
        alertBox.classList.remove("hidden");
    }
}

function hideError() {
    const alertBox = document.getElementById("error-alert");
    if (alertBox) alertBox.classList.add("hidden");
}

// FILE VALIDATION
function isFilesValid(selectedFiles) {
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (selectedFiles.length === 0) return false;

    for (let file of selectedFiles) {
        if (file.size > maxSize) {
            showError(`File "${file.name}" is too large. Max 50MB per file.`);
            fileInput.value = ""; // Clear input on error
            return false;
        }
    }
    hideError();
    return true;
}

// MAIN SUBMIT LOGIC
form.addEventListener("submit", function (e) {
    const files = fileInput.files;

    // Check if files exist and are valid
    if (!isFilesValid(files)) {
        e.preventDefault();
        loader.classList.add("hidden");
        return;
    }

    // If valid, show loader
    loader.classList.remove("hidden");
});

// Server-side error check from URL
window.addEventListener("load", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorMsg = urlParams.get("error");
    if (errorMsg) {
        showError(decodeURIComponent(errorMsg));
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// This script handles UI interactions including form submission with loader display, 
// dark mode toggle with persistence, error handling via URL parameters, 
// and client-side validation for uploaded PDF files.