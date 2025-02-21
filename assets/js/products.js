// Dữ liệu sản phẩm từ Thế Giới Di Động
const products = {
    laptops: [
        {
            id: "l1",
            name: "Laptop Apple MacBook Air 15 inch M2 2023",
            price: 31990000,
            image: "https://cdn.tgdd.vn/Products/Images/44/309016/apple-macbook-air-m2-2023-starlight-thumb-1-600x600.jpg",
            category: "laptop",
            description:
                "Apple M2, RAM 8GB, SSD 256GB, 15.3 inch IPS Retina, MacOS",
            brand: "Apple",
            quantity: 10,
            featured: true,
        },
        {
            id: "l2",
            name: "Laptop Gaming Acer Nitro 5 Tiger",
            price: 19990000,
            image: "https://cdn.tgdd.vn/Products/Images/44/283458/TimerThumb/acer-nitro-5-tiger-an515-58-773y-i7-nhqfksv001-(2).png",
            category: "laptop",
            description:
                "i5 12500H, RAM 8GB, SSD 512GB, RTX 2050 4GB, 15.6 inch FHD 144Hz",
            brand: "Acer",
            quantity: 10,
            featured: true,
        },
        {
            id: "l3",
            name: "Laptop Asus Gaming ROG Strix G15",
            price: 29990000,
            image: "https://cdn.tgdd.vn/Products/Images/44/270031/asus-rog-strix-gaming-g513ih-r7-4800h-8gb-512gb-4gb-600x600.jpg",
            category: "laptop",
            description:
                "Ryzen 7 6800H, RAM 8GB, SSD 512GB, RTX 3050 4GB, 15.6 inch FHD 144Hz",
            brand: "Asus",
            quantity: 10,
            featured: true,
        },
        {
            id: "l4",
            name: "Laptop MSI Gaming GF63 Thin",
            price: 15990000,
            image: "https://cdn.tgdd.vn/Products/Images/44/303499/msi-gaming-gf63-thin-11uc-i5-1230vn-thumb-600x600.jpg",
            category: "laptop",
            description:
                "i5 11400H, RAM 8GB, SSD 512GB, RTX 3050 4GB, 15.6 inch FHD 144Hz",
            brand: "MSI",
            featured: false,
        },
    ],

    smartwatches: [
        {
            id: "sw1",
            name: "Apple Watch Series 9 GPS",
            price: 10990000,
            image: "https://cdn.tgdd.vn/Products/Images/7077/314696/apple-watch-s9-lte-41mm-vien-thep-khong-gi-day-thep-vang-thumb-1-600x600.png",
            category: "smartwatch",
            description: "41mm, Viền nhôm, Dây cao su, Chip S9 SiP",
            quantity: 10,
            brand: "Apple",
            featured: true,
        },
        {
            id: "sw2",
            name: "Samsung Galaxy Watch 6 Classic",
            price: 8990000,
            image: "https://cdn.tgdd.vn/Products/Images/7077/310858/samsung-galaxy-watch6-classic-47-mm-bac-ksp-600x600.jpg",
            category: "smartwatch",
            description: "47mm, Viền thép không gỉ, Dây silicone",
            quantity: 10,
            brand: "Samsung",
            featured: true,
        },
        {
            id: "sw3",
            name: "Xiaomi Watch S1 Pro",
            price: 6490000,
            image: "https://cdn.tgdd.vn/Products/Images/7077/321817/xiaomi-watch-s-3-bac-tn-600x600.jpg",
            category: "smartwatch",
            description: "46mm, Viền thép không gỉ, Dây da cao cấp",
            quantity: 10,
            brand: "Xiaomi",
            featured: false,
        },
        {
            id: "sw4",
            name: "Garmin Forerunner 955",
            price: 14990000,
            image: "https://cdn.tgdd.vn/Products/Images/7077/283209/garmin-forerunner-955-day-silicone-den-tn-600x600.jpg",
            category: "smartwatch",
            description: "46.5mm, Viền nhựa composite, Dây silicone",
            quantity: 10,
            brand: "Garmin",
            featured: false,
        },
    ],

    headphones: [
        {
            id: "h1",
            name: "AirPods Pro 2",
            price: 6790000,
            image: "https://cdn.tgdd.vn/Products/Images/54/315014/tai-nghe-bluetooth-airpods-pro-2nd-gen-usb-c-charge-apple-thumb-1-600x600.jpg",
            category: "headphone",
            description: "Chống ồn chủ động, Spatial Audio, Chip H2",
            quantity: 10,
            brand: "Apple",
            featured: true,
        },
        {
            id: "h2",
            name: "Sony WH-1000XM5",
            price: 8490000,
            image: "https://cdn.tgdd.vn/Products/Images/54/328098/tai-nghe-bluetooth-chup-tai-sony-wh1000xm4-300724-033610-600x600.jpg",
            category: "headphone",
            description: "Chống ồn chủ động, LDAC, 30 giờ pin",
            quantity: 0,
            brand: "Sony",
            featured: true,
        },
        {
            id: "h3",
            name: "Samsung Galaxy Buds2 Pro",
            price: 4990000,
            image: "https://cdn.tgdd.vn/Products/Images/54/327553/tai-nghe-bluetooth-true-wireless-samsung-galaxy-buds-3-r530n-120724-112318-600x600.jpg",
            category: "headphone",
            description: "24bit Hi-Fi, Chống ồn chủ động, 360 Audio",
            quantity: 10,
            brand: "Samsung",
            featured: false,
        },
        {
            id: "h4",
            name: "JBL Tour One M2",
            price: 7490000,
            image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/332454/tai-nghe-tws-jbl-tour-pro-3-071224-084607-307-600x600.jpg",
            category: "headphone",
            description: "Chống ồn thích ứng, JBL Pro Sound, 50 giờ pin",
            quantity: 10,
            brand: "JBL",
            featured: false,
        },
        {
            id: "h5",
            name: "JBL Tour One M2",
            price: 7490000,
            image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/332454/tai-nghe-tws-jbl-tour-pro-3-071224-084607-307-600x600.jpg",
            category: "headphone",
            description: "Chống ồn thích ứng, JBL Pro Sound, 50 giờ pin",
            brand: "JBL",
            featured: false,
        },
        {
            id: "h6",
            name: "JBL Tour One M2",
            price: 7490000,
            image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/54/332454/tai-nghe-tws-jbl-tour-pro-3-071224-084607-307-600x600.jpg",
            category: "headphone",
            description: "Chống ồn thích ứng, JBL Pro Sound, 50 giờ pin",
            quantity: 10,
            brand: "JBL",
            featured: false,
        },
    ],
};

// Biến để lưu trữ trạng thái lọc hiện tại
let filteredProducts = [];
let sortOption = "newest";

// Lưu và cập nhật dữ liệu vào localStorage khi trang web load
function initializeProducts() {
    // Luôn cập nhật lại dữ liệu mới nhất
    localStorage.setItem("products", JSON.stringify(products));
    console.log("Products updated in localStorage");

    // Kiểm tra dữ liệu đã được cập nhật
    const savedProducts = JSON.parse(localStorage.getItem("products"));
    console.log("Current products in localStorage:", savedProducts);
}

// Hàm lấy sản phẩm từ localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || products;
}

// Hàm lấy sản phẩm theo danh mục
function getProductsByCategory(category) {
    const allProducts = getProducts();
    return allProducts[category] || [];
}

// Hàm lấy sản phẩm nổi bật (9 sản phẩm, mỗi loại 3 sản phẩm)
function getFeaturedProducts() {
    const allProducts = getProducts();
    console.log("All Products:", allProducts); // Log toàn bộ sản phẩm

    const featured = [];
    const categories = ["laptops", "smartwatches", "headphones"];

    categories.forEach((category) => {
        console.log(`Getting products from category: ${category}`);
        const products = allProducts[category]
            .sort((a, b) => {
                const aNum = parseInt(a.id.replace(/[^\d]/g, ""));
                const bNum = parseInt(b.id.replace(/[^\d]/g, ""));
                return bNum - aNum;
            })
            .slice(0, 3);

        console.log(`Products from ${category}:`, products);
        featured.push(...products);
    });

    console.log("Final Featured Products:", featured);
    return featured;
}

// Hàm lấy chi tiết sản phẩm theo ID
function getProductById(productId) {
    const allProducts = getProducts();
    let foundProduct = null;

    Object.values(allProducts).forEach((category) => {
        const product = category.find((p) => p.id === productId);
        if (product) {
            foundProduct = product;
        }
    });

    return foundProduct;
}

// Thêm hàm getAllProducts
function getAllProducts() {
    const allProducts = getProducts();
    const result = [];
    const categories = ["laptops", "smartwatches", "headphones"];

    categories.forEach((category) => {
        if (allProducts[category]) {
            result.push(...allProducts[category]);
        }
    });

    return result;
}

// Sửa lại hàm getRelatedProducts
function getRelatedProducts(product) {
    const allProducts = getAllProducts();
    return allProducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4); // Chỉ lấy 4 sản phẩm liên quan
}

// Hàm format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

// Hàm tạo HTML cho card sản phẩm
function createProductCard(product) {
    const cardClass =
        product.category === "laptop" ? "laptop-card" : "device-card";
    const imageClass =
        product.category === "laptop"
            ? "laptop-card__image"
            : "device-card__image";

    return `
        <div class="${cardClass}" data-id="${product.id}">
            <div class="${imageClass}">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="card-content">
                <h3 class="card-title">${product.name}</h3>
                <div class="card-price">${formatPrice(product.price)}</div>
                <div class="card-actions">
                    <button class="btn add-to-cart-btn">
                        <i class="fas fa-shopping-cart"></i>
                        Thêm vào giỏ
                    </button>
                    <button class="btn view-detail-btn">
                        <i class="fas fa-eye"></i>
                        Chi tiết
                    </button>
                </div>
            </div>
        </div>
        
    `;
}
const PRODUCTS_PER_PAGE = 9;
let currentPage = 1;

function renderProducts(products) {
    // Lưu danh sách sản phẩm đã lọc
    filteredProducts = [...products];
    
    const productsGrid = document.getElementById("productsGrid");
    const productsPagination = document.getElementById("productsPagination");
    if (!productsGrid || !productsPagination) return;

    // Áp dụng sắp xếp
    sortProducts();
    
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    const currentProducts = filteredProducts.slice(start, end);

    // Ẩn loading spinner
    const loaderOverlay = document.querySelector('.loader-overlay');
    if (loaderOverlay) {
        loaderOverlay.style.display = 'none';
    }

    // Render products
    productsGrid.innerHTML = `
        ${currentProducts
            .map(
                (product) => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-card__image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.name}</h3>
                    <div class="product-card__price">${formatPrice(
                        product.price
                    )}</div>
                    <div class="product-card__actions">
                        <button class="btn btn--primary ${
                            !product.quantity || product.quantity <= 0 ? "btn--disabled" : ""
                        }" 
                                onclick="handleAddToCart('${product.id}')"
                                ${!product.quantity || product.quantity <= 0 ? "disabled" : ""}>
                            ${
                                !product.quantity || product.quantity <= 0
                                    ? "Hết hàng"
                                    : "Thêm vào giỏ hàng"
                            }
                        </button>
                        <a href="product-detail.html?id=${
                            product.id
                        }" class="btn btn--secondary">
                            <i class="fas fa-info-circle"></i>
                            Chi tiết
                        </a>
                    </div>
                </div>
            </div>
        `
            )
            .join("")}
    `;

    // Hiển thị thông báo khi không có sản phẩm
    if (currentProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products-message">
                <p>Không tìm thấy sản phẩm phù hợp với bộ lọc đã chọn.</p>
                <button class="btn btn--primary" onclick="resetFilters()">Xóa bộ lọc</button>
            </div>
        `;
    }

    // Render pagination
    if (totalPages > 1) {
        productsPagination.innerHTML = `
            ${Array.from({ length: totalPages }, (_, i) => i + 1)
                .map(
                    (page) => `
                <button class="pagination-btn ${
                    page === currentPage ? "active" : ""
                }"
                        onclick="handlePageChange(${page})">
                    ${page}
                </button>
            `
                )
                .join("")}
        `;
    } else {
        productsPagination.innerHTML = "";
    }
}

// Hàm để sắp xếp sản phẩm dựa trên tuỳ chọn hiện tại
function sortProducts() {
    switch (sortOption) {
        case "price-asc":
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case "newest":
            // Mặc định là mới nhất, không cần sắp xếp thêm
            break;
    }
}

// Hàm reset bộ lọc
function resetFilters() {
    // Reset checkbox
    document.querySelectorAll('.filter-option input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Reset radio buttons
    document.querySelectorAll('.filter-option input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });
    
    // Reset dropdown sắp xếp
    document.querySelector(".products-sort").value = "newest";
    sortOption = "newest";
    
    // Hiển thị lại tất cả sản phẩm
    currentPage = 1;
    renderProducts(getAllProducts());
}

// Cập nhật bộ lọc chi tiết hơn
function setupFilters() {
    // Lọc theo danh mục
    document
        .querySelectorAll('.filter-option input[type="checkbox"]')
        .forEach((checkbox) => {
            checkbox.addEventListener("change", filterProducts);
        });

    // Lọc theo giá
    document
        .querySelectorAll('.filter-option input[type="radio"]')
        .forEach((radio) => {
            radio.addEventListener("change", filterProducts);
        });

    // Sắp xếp
    const sortSelect = document.querySelector(".products-sort");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            sortOption = e.target.value;
            renderProducts(filteredProducts); // Sử dụng danh sách đã lọc
        });
    } else {
        console.warn("Element with class 'products-sort' not found");
    }
}

function filterProducts() {
    let products = getAllProducts();
    const selectedCategories = [
        ...document.querySelectorAll(
            '.filter-option input[type="checkbox"]:checked'
        ),
    ].map((cb) => cb.value);
    const selectedPrice = document.querySelector(
        '.filter-option input[type="radio"]:checked'
    )?.value;

    // Lọc theo danh mục
    if (selectedCategories.length) {
        products = products.filter((p) =>
            selectedCategories.includes(p.category)
        );
    }

    // Lọc theo giá
    if (selectedPrice) {
        if (selectedPrice === "20000000+") {
            products = products.filter((p) => p.price >= 20000000);
        } else {
            const [min, max] = selectedPrice.split("-").map(Number);
            products = products.filter((p) => {
                if (max) {
                    return p.price >= min && p.price <= max;
                }
                return p.price >= min;
            });
        }
    }

    currentPage = 1; // Reset về trang đầu khi lọc
    renderProducts(products);
}

function handlePageChange(page) {
    currentPage = page;
    renderProducts(filteredProducts); // Sử dụng danh sách đã lọc
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Thêm hàm xử lý thêm vào giỏ hàng
function handleAddToCart(productId) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        showToast("Vui lòng đăng nhập để thêm vào giỏ hàng", "error");
        return;
    }

    const product = getProductById(productId);
    if (!product) return;

    if (!product.quantity || product.quantity <= 0) {
        showToast("Sản phẩm tạm hết hàng", "error");
        return;
    }

    const cartKey = `cart_${user.id}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
        if (existingProduct.quantity + 1 > product.quantity) {
            showToast("Số lượng sản phẩm trong kho không đủ", "error");
            return;
        }
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1,
            name: product.name,
            price: product.price,
            image: product.image,
        });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    showToast("Đã thêm sản phẩm vào giỏ hàng", "success");
    updateCartCount(); // Cập nhật số lượng trong giỏ hàng
}

// Thêm hàm updateCartCount
function updateCartCount() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const cartKey = `cart_${user.id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = cartCount > 0 ? "block" : "none";
    }
}

function searchProducts(searchTerm) {
    if (!searchTerm) return getAllProducts();

    searchTerm = searchTerm.toLowerCase();
    return getAllProducts().filter((product) => {
        // Tìm theo tên sản phẩm
        const nameMatch = product.name.toLowerCase().includes(searchTerm);

        // Tìm theo danh mục
        const categoryMatch = product.category
            .toLowerCase()
            .includes(searchTerm);

        // Tìm theo từ khóa
        const keywords = [
            "laptop",
            "máy tính",
            "notebook",
            "đồng hồ",
            "smartwatch",
            "watch",
            "tai nghe",
            "headphone",
            "earphone",
        ];

        const keywordMatch = keywords.some((keyword) => {
            if (keyword.includes(searchTerm) || searchTerm.includes(keyword)) {
                return product.category.toLowerCase().includes(keyword);
            }
            return false;
        });

        return nameMatch || categoryMatch || keywordMatch;
    });
}

// Hàm hiển thị thông báo - giả định rằng đã có
function showToast(message, type) {
    // Kiểm tra xem đã có hàm toàn cục hay chưa
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
    } else {
        // Nếu chưa có, tạo thông báo đơn giản
        alert(message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Khởi tạo sản phẩm trong localStorage
    initializeProducts();
    
    // Thiết lập các bộ lọc
    setupFilters();

    
    
    // Hiển thị loading spinner
    const loaderOverlay = document.querySelector('.loader-overlay');
    if (loaderOverlay) {
        loaderOverlay.style.display = 'flex';
    }
    
    // Kiểm tra xem có từ khóa tìm kiếm không
    const searchTerm = localStorage.getItem("searchTerm");

    if (searchTerm) {
        // Xóa từ khóa sau khi đã sử dụng
        localStorage.removeItem("searchTerm");

        // Tìm kiếm sản phẩm
        const searchResults = searchProducts(searchTerm);

        if (searchResults.length > 0) {
            renderProducts(searchResults);
            showToast(
                `Tìm thấy ${searchResults.length} sản phẩm cho "${searchTerm}"`,
                "success"
            );
        } else {
            renderProducts(getAllProducts());
            showToast(
                `Không tìm thấy sản phẩm nào cho "${searchTerm}"`,
                "error"
            );
        }
    } else {
        // Hiển thị tất cả sản phẩm nếu không có tìm kiếm
        renderProducts(getAllProducts());
    }
    
    // Cập nhật số lượng giỏ hàng
    updateCartCount();
});