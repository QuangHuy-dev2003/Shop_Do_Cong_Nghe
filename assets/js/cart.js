// Khởi tạo giỏ hàng từ localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const ITEMS_PER_PAGE = 5;
let currentPage = 1;

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId, quantity = 1) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        showToast("Vui lòng đăng nhập để thêm vào giỏ hàng", "error");
        return;
    }

    const cartKey = `cart_${user.id}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        const product = getProductById(productId);
        if (!product) return;

        cart.push({
            id: productId,
            quantity: quantity,
            name: product.name,
            price: product.price,
            image: product.image,
        });
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount();
    showToast("Đã thêm sản phẩm vào giỏ hàng", "success");
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartQuantity(productId, quantity) {
    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
        if (quantity > 0) {
            cartItem.quantity = quantity;
        } else {
            // Xóa sản phẩm khỏi giỏ hàng nếu số lượng = 0
            cart = cart.filter((item) => item.id !== productId);
        }
        saveCart();
        renderCart();
        updateCartTotal();
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    showLoading();
    setTimeout(() => {
        const cartKey = `cart_${user.id}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        cart = cart.filter((item) => item.id !== productId);
        localStorage.setItem(cartKey, JSON.stringify(cart));

        renderCart();
        loadUserCart();
        hideLoading();
        showToast("Đã xóa sản phẩm khỏi giỏ hàng");
    }, 500);
}

// Lưu giỏ hàng vào localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    const cartCountElement = document.querySelector(".header__cart-count");
    if (!cartCountElement) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        const cartKey = `cart_${user.id}`;
        const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        cartCountElement.textContent = cart.length;
    } else {
        cartCountElement.textContent = "0";
    }
}

// Tính tổng tiền giỏ hàng
function calculateCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Cập nhật hiển thị tổng tiền
function updateCartTotal() {
    const subtotalElement = document.getElementById("cartSubtotal");
    const totalElement = document.getElementById("cartTotal");

    if (subtotalElement && totalElement) {
        const subtotal = calculateCartTotal();
        const shipping = subtotal > 500000 ? 0 : 30000; // Miễn phí ship cho đơn > 500k
        const total = subtotal + shipping;

        subtotalElement.textContent = formatPrice(subtotal);
        totalElement.textContent = formatPrice(total);
    }
}

// Render giỏ hàng
function renderCart() {
    const cartItems = document.getElementById("cartItems");
    if (!cartItems) return;

    showLoading();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Vui lòng đăng nhập để xem giỏ hàng</p>
                <a href="/login.html" class="btn btn--primary">Đăng nhập</a>
            </div>
        `;
        hideLoading();
        return;
    }

    const cartKey = `cart_${user.id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    setTimeout(() => {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Giỏ hàng của bạn đang trống</p>
                    <a href="/products.html" class="btn btn--primary">Mua sắm ngay</a>
                </div>
            `;
        } else {
            // Tính toán phân trang
            const totalPages = Math.ceil(cart.length / ITEMS_PER_PAGE);
            const start = (currentPage - 1) * ITEMS_PER_PAGE;
            const end = start + ITEMS_PER_PAGE;
            const currentItems = cart.slice(start, end);

            cartItems.innerHTML = `
                ${currentItems
                    .map(
                        (item) => `
                    <div class="cart-item" data-id="${item.id}" data-price="${
                            item.price
                        }">
                        <input type="checkbox" class="cart-checkbox">
                        <div class="cart-item__image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item__content">
                            <h3 class="cart-item__title">${item.name}</h3>
                            <div class="cart-item__price">${formatPrice(
                                item.price
                            )}</div>
                            <div class="cart-item__quantity">
                                <button class="quantity-btn minus" onclick="updateQuantity('${
                                    item.id
                                }', ${item.quantity - 1})">-</button>
                                <input type="number" value="${
                                    item.quantity
                                }" min="1" class="quantity-input" 
                                       onchange="updateQuantity('${
                                           item.id
                                       }', this.value)">
                                <button class="quantity-btn plus" onclick="updateQuantity('${
                                    item.id
                                }', ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <button class="cart-item__remove" onclick="removeFromCart('${
                            item.id
                        }')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `
                    )
                    .join("")}
                
                ${
                    totalPages > 1
                        ? `
                    <div class="pagination">
                        ${Array.from({ length: totalPages }, (_, i) => i + 1)
                            .map(
                                (page) => `
                            <button class="pagination-btn ${
                                page === currentPage ? "active" : ""
                            }"
                                    onclick="changePage(${page})">${page}</button>
                        `
                            )
                            .join("")}
                    </div>
                `
                        : ""
                }
            `;
        }
        hideLoading();
    }, 500);
}

// Thêm hàm updateQuantity
function updateQuantity(productId, newQuantity) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const cartKey = `cart_${user.id}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    if (newQuantity < 1) {
        cart = cart.filter((item) => item.id !== productId);
    } else {
        const item = cart.find((item) => item.id === productId);
        if (item) {
            item.quantity = parseInt(newQuantity);
        }
    }

    localStorage.setItem(cartKey, JSON.stringify(cart));
    renderCart();
    loadUserCart();
}

// Xử lý đặt hàng
function handleCheckout() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        showToast("Vui lòng đăng nhập để thanh toán", "error");
        return;
    }

    const checkboxes = document.querySelectorAll(".cart-checkbox:checked");
    if (checkboxes.length === 0) {
        showToast("Vui lòng chọn sản phẩm để thanh toán", "error");
        return;
    }

    showLoading();
    setTimeout(() => {
        // Lấy thông tin sản phẩm đã chọn
        const selectedItems = [];
        let total = 0;

        checkboxes.forEach((checkbox) => {
            const cartItem = checkbox.closest(".cart-item");
            const productId = cartItem.dataset.id;
            const price = parseFloat(cartItem.dataset.price);
            const quantity = parseInt(
                cartItem.querySelector(".quantity-input").value
            );

            selectedItems.push({
                id: productId,
                quantity: quantity,
                price: price,
            });
            total += price * quantity;
        });

        // Lưu thông tin đơn hàng tạm thời
        localStorage.setItem(
            `order_${user.id}`,
            JSON.stringify({
                items: selectedItems,
                total: total + 30000, // Thêm phí vận chuyển
            })
        );

        hideLoading();
        // Chuyển hướng đến trang thanh toán
        window.location.href = "/checkout.html";
    }, 500);
}

// Gọi updateCartCount khi load trang và sau khi đăng nhập
document.addEventListener("DOMContentLoaded", updateCartCount);

// Load cart khi trang được load
document.addEventListener("DOMContentLoaded", () => {
    showLoading();
    setTimeout(() => {
        renderCart();
        hideLoading();

        // Thêm sự kiện cho nút thanh toán
        const checkoutBtn = document.getElementById("checkoutBtn");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", handleCheckout);
        }
    }, 1000);
});

// Thêm vào cart.js
function showConfirmModal() {
    document.getElementById("confirmModal").style.display = "flex";
}

function hideConfirmModal() {
    document.getElementById("confirmModal").style.display = "none";
}

function clearCart() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    showLoading();
    setTimeout(() => {
        localStorage.removeItem(`cart_${user.id}`);
        hideConfirmModal();
        renderCart();
        loadUserCart();
        hideLoading();
        showToast("Đã xóa tất cả sản phẩm");
    }, 1000);
}

// Thêm xử lý checkbox
document.addEventListener("change", function (e) {
    if (e.target.classList.contains("cart-checkbox")) {
        updateSelectedTotal();
    }
});

function updateSelectedTotal() {
    const checkboxes = document.querySelectorAll(".cart-checkbox:checked");
    const checkoutBtn = document.getElementById("checkoutBtn");
    let total = 0;

    checkboxes.forEach((checkbox) => {
        const cartItem = checkbox.closest(".cart-item");
        const price = parseFloat(cartItem.dataset.price);
        const quantity = parseInt(
            cartItem.querySelector(".quantity-input").value
        );
        total += price * quantity;
    });

    // Enable/disable nút thanh toán dựa trên số lượng sản phẩm đã chọn
    if (checkoutBtn) {
        checkoutBtn.disabled = checkboxes.length === 0;
    }

    document.getElementById("cartSubtotal").textContent = formatPrice(total);
    document.getElementById("cartTotal").textContent = formatPrice(
        total + 30000
    );
}

function changePage(page) {
    currentPage = page;
    renderCart();
}
