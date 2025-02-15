document.addEventListener("DOMContentLoaded", () => {
    const loaderOverlay = document.querySelector(".loader-overlay");
    if (loaderOverlay) {
        loaderOverlay.style.display = "flex";
        
        setTimeout(() => {
            loaderOverlay.style.display = "none";
        }, 1000);
    }
}); 