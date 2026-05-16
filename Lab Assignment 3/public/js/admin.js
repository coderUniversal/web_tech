// ================================================
//  ADMIN PANEL — admin.js
// ================================================


// ------------------------------------------------
// 1. confirmDelete(productName)
//    Called by delete form's onsubmit
//    Returns true = allow delete, false = cancel
// ------------------------------------------------
function confirmDelete(productName) {
    return confirm(
        "Are you sure you want to delete \"" + productName + "\"?\nThis cannot be undone."
    );
}


// ------------------------------------------------
// 2. previewImage(event)
//    Called by image file input's onchange
//    Shows a live thumbnail preview of selected image
// ------------------------------------------------
function previewImage(event) {
    const file = event.target.files[0];

    // If no file selected, do nothing
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        // Show the preview container
        const previewContainer = document.getElementById("previewContainer");
        if (previewContainer) {
            previewContainer.style.display = "block";
        }

        // Set the preview image src to the file data
        const imagePreview = document.getElementById("imagePreview");
        if (imagePreview) {
            imagePreview.src = e.target.result;
        }

        // Hide the upload hint text
        const uploadHint = event.target
            .closest(".file-upload-area")
            .querySelector(".upload-hint");
        if (uploadHint) {
            uploadHint.style.display = "none";
        }
    };

    // Read the file as a data URL (base64)
    reader.readAsDataURL(file);
}


// ------------------------------------------------
// 3. Auto-hide success alert after 4 seconds
//    Runs when the page finishes loading
// ------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
    const successAlert = document.getElementById("successAlert");

    if (successAlert) {
        setTimeout(function () {
            // Fade out smoothly
            successAlert.style.transition = "opacity 0.8s ease";
            successAlert.style.opacity = "0";

            // Remove from page after fade completes
            setTimeout(function () {
                successAlert.style.display = "none";
            }, 800);

        }, 4000); // Wait 4 seconds before fading
    }
});