document.addEventListener("DOMContentLoaded", () => {
    const loaderOverlay = document.querySelector(".loader-overlay");
    if (loaderOverlay) {
        loaderOverlay.style.display = "flex";
        
        setTimeout(() => {
            loaderOverlay.style.display = "none";
        }, 1000);
    }

    // Xử lý form liên hệ
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", handleContactSubmit);
    }
});

function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    showLoading();
    
    // Giả lập gửi form
    setTimeout(() => {
        hideLoading();
        showToast("Gửi tin nhắn thành công", "success");
        e.target.reset();
    }, 1000);
} 