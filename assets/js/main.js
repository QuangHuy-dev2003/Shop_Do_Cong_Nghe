document.addEventListener("DOMContentLoaded", function () {
    // Load header và footer
    loadComponents();

    // Khởi tạo trang
    initializePage();

    // Xử lý sự kiện
    setupEventListeners();
});

// Load components
async function loadComponents() {
    try {
        // Load header
        const headerResponse = await fetch("/components/header.html");
        const headerHtml = await headerResponse.text();
        document.getElementById("header").innerHTML = headerHtml;

        // Load footer
        const footerResponse = await fetch("/components/footer.html");
        const footerHtml = await footerResponse.text();
        document.getElementById("footer").innerHTML = footerHtml;
    } catch (error) {
        console.error("Error loading components:", error);
    }
}

// Khởi tạo trang
function initializePage() {
    // Hiển thị loading
    showLoading();

    // Render sản phẩm nổi bật
    displayFeaturedProducts();

    // Render các section sản phẩm
    renderProductSections();

    // Ẩn loading
    hideLoading();
}

// Render sản phẩm nổi bật
function renderFeaturedProducts() {
    const featuredProducts = getFeaturedProducts();
    const featuredWrapper = document.getElementById("featuredProducts");

    if (featuredWrapper) {
        featuredWrapper.innerHTML = featuredProducts
            .map((product) => createProductCard(product))
            .join("");
    }
}

// Render các section sản phẩm
function renderProductSections() {
    // Render Laptops
    const laptopGrid = document.getElementById("laptopProducts");
    if (laptopGrid) {
        const laptops = getProductsByCategory("laptops")
            .sort((a, b) => {
                const aNum = parseInt(a.id.replace(/[^\d]/g, ""));
                const bNum = parseInt(b.id.replace(/[^\d]/g, ""));
                return bNum - aNum;
            })
            .slice(0, 4);

        laptopGrid.innerHTML = `
            ${laptops.map((product) => createProductCard(product)).join("")}
        `;
    }

    // Render Smartwatches
    const smartwatchGrid = document.getElementById("smartwatchProducts");
    if (smartwatchGrid) {
        const smartwatches = getProductsByCategory("smartwatches")
            .sort((a, b) => {
                const aNum = parseInt(a.id.replace(/[^\d]/g, ""));
                const bNum = parseInt(b.id.replace(/[^\d]/g, ""));
                return bNum - aNum;
            })
            .slice(0, 4);

        smartwatchGrid.innerHTML = `
            ${smartwatches
                .map((product) => createProductCard(product))
                .join("")}
        `;
    }

    // Render Headphones
    const headphoneGrid = document.getElementById("headphoneProducts");
    if (headphoneGrid) {
        const headphones = getProductsByCategory("headphones")
            .sort((a, b) => {
                const aNum = parseInt(a.id.replace(/[^\d]/g, ""));
                const bNum = parseInt(b.id.replace(/[^\d]/g, ""));
                return bNum - aNum;
            })
            .slice(0, 4);

        headphoneGrid.innerHTML = `
            ${headphones.map((product) => createProductCard(product)).join("")}
        `;
    }
}

// Xử lý sự kiện
function setupEventListeners() {
    // Xử lý nút thêm vào giỏ hàng
    document.addEventListener("click", function (e) {
        if (e.target.closest(".add-to-cart-btn")) {
            const productCard = e.target.closest("[data-id]");
            const productId = productCard.dataset.id;
            addToCart(productId);
        }
    });

    // Xử lý nút xem chi tiết
    document.addEventListener("click", function (e) {
        if (e.target.closest(".view-detail-btn")) {
            const productCard = e.target.closest("[data-id]");
            const productId = productCard.dataset.id;
            viewProductDetail(productId);
        }
    });

    // Xử lý nút xem thêm
    document.addEventListener("click", function (e) {
        const viewMoreBtn = e.target.closest(".view-more-btn");
        if (viewMoreBtn) {
            const category = viewMoreBtn.dataset.category;
            viewAllProducts(category);
        }
    });
}

// Thêm hàm xử lý xem tất cả sản phẩm
function viewAllProducts(category) {
    // Có thể chuyển hướng đến trang danh sách sản phẩm
    window.location.href = `/products.html?category=${category}`;
    // Hoặc mở modal hiển thị tất cả sản phẩm
    // showProductsModal(category);
}

// Cập nhật HTML cho phần featured products
function displayFeaturedProducts() {
    const slider = document.querySelector(".featured__slider");
    const wrapper = document.querySelector(".featured__wrapper");

    if (!slider || !wrapper) return;

    slider.classList.add("loading");
    slider.classList.remove("loaded");

    const featuredProducts = getFeaturedProducts();

    wrapper.innerHTML = featuredProducts
        .map(
            (product, index) => `
            <div class="featured__slide" data-index="${index}">
                ${createProductCard(product)}
            </div>
        `
        )
        .join("");

    initFeaturedSlider(featuredProducts.length);

    setTimeout(() => {
        slider.classList.remove("loading");
        slider.classList.add("loaded");

        const slides = wrapper.querySelectorAll(".featured__slide");
        slides.forEach((slide, index) => {
            if (index < 3) {
                slide.classList.add("active");
            }
        });
    }, 100);
}

function initFeaturedSlider(totalSlides) {
    const wrapper = document.querySelector(".featured__wrapper");
    const slides = wrapper.querySelectorAll(".featured__slide");
    const prevBtn = document.querySelector(".featured__nav--prev");
    const nextBtn = document.querySelector(".featured__nav--next");
    const dotsContainer = document.querySelector(".featured__dots");

    let currentIndex = 0;
    const slidesPerView = 3;
    const totalGroups = Math.ceil(totalSlides / slidesPerView);
    const slideWidth = (wrapper.offsetWidth - 30) / 3;

    function updateSlider() {
        const offset = -(currentIndex * slidesPerView * slideWidth);
        wrapper.style.transform = `translateX(${offset}px)`;

        slides.forEach((slide, index) => {
            const isInView =
                index >= currentIndex * slidesPerView &&
                index < (currentIndex + 1) * slidesPerView;

            if (isInView) {
                slide.classList.add("active");
                slide.style.transform = "scale(1)";
                slide.style.opacity = "1";
                slide.style.visibility = "visible";
            } else {
                slide.classList.remove("active");
                slide.style.transform = "scale(0.95)";
                slide.style.opacity = "0";
                slide.style.visibility = "hidden";
            }
        });

        updateNavigation();
        updateDots();
    }

    // Cập nhật CSS cho wrapper và slides
    wrapper.style.display = "flex";
    wrapper.style.width = `${
        slideWidth * totalSlides + (totalSlides - 1) * 15
    }px`;
    wrapper.style.transition = "transform 0.5s ease";

    slides.forEach((slide) => {
        slide.style.flex = `0 0 ${slideWidth}px`;
        slide.style.width = `${slideWidth}px`;
    });

    function updateNavigation() {
        prevBtn.style.display = currentIndex > 0 ? "flex" : "none";
        nextBtn.style.display =
            currentIndex < totalGroups - 1 ? "flex" : "none";
    }

    function updateDots() {
        dotsContainer.innerHTML = "";
        for (let i = 0; i < totalGroups; i++) {
            const dot = document.createElement("div");
            dot.className = `featured__dot ${
                i === currentIndex ? "active" : ""
            }`;
            dot.addEventListener("click", () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex >= totalGroups) currentIndex = 0;
        if (currentIndex < 0) currentIndex = totalGroups - 1;
        updateSlider();
    }

    prevBtn?.addEventListener("click", () => goToSlide(currentIndex - 1));
    nextBtn?.addEventListener("click", () => goToSlide(currentIndex + 1));

    updateSlider();
}

// Hiển thị/ẩn loading
function showLoading() {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) {
        spinner.style.display = "block";
    }
}

function hideLoading() {
    const spinner = document.getElementById("loadingSpinner");
    if (spinner) {
        spinner.style.display = "none";
    }
}

// Hiển thị toast thông báo
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.textContent = message;

    const container = document.getElementById("toastContainer");
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast--fade-in");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("toast--fade-in");
        toast.classList.add("toast--fade-out");
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}
