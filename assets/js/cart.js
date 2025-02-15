// Khởi tạo giỏ hàng từ localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const CART_ITEMS_PER_PAGE = 5;
let cartCurrentPage = 1;

let selectedItems = new Set(); // Thêm biến để lưu các item được chọn

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId, quantity = 1) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        showToast("Vui lòng đăng nhập để thêm vào giỏ hàng", "error");
        return;
    }

    const product = getProductById(productId);
    if (!product) return;

    // Kiểm tra số lượng tồn kho
    if (product.quantity <= 0) {
        showToast("Sản phẩm tạm hết hàng", "error");
        return;
    }

    const cartKey = `cart_${user.id}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingProduct = cart.find((item) => item.id === productId);
    if (existingProduct) {
        // Kiểm tra nếu số lượng mới vượt quá tồn kho
        if (existingProduct.quantity + quantity > product.quantity) {
            showToast("Số lượng sản phẩm trong kho không đủ", "error");
            return;
        }
        existingProduct.quantity += quantity;
    } else {
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

// Thêm hàm để lưu trạng thái checkbox
function saveSelectedItems() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    localStorage.setItem(
        `selectedItems_${user.id}`,
        JSON.stringify([...selectedItems])
    );
}

// Thêm hàm để load trạng thái checkbox
function loadSelectedItems() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    const saved = localStorage.getItem(`selectedItems_${user.id}`);
    if (saved) {
        selectedItems = new Set(JSON.parse(saved));
        // Cập nhật tổng tiền ngay sau khi load selected items
        setTimeout(() => {
            updateSelectedTotal();
        }, 0);
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

    // Load trạng thái checkbox đã lưu
    loadSelectedItems();

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
            const totalPages = Math.ceil(cart.length / CART_ITEMS_PER_PAGE);
            const start = (cartCurrentPage - 1) * CART_ITEMS_PER_PAGE;
            const end = start + CART_ITEMS_PER_PAGE;
            const currentItems = cart.slice(start, end);

            cartItems.innerHTML = currentItems
                .map((item) => {
                    const product = getProductById(item.id);
                    const isOutOfStock = product.quantity <= 0;

                    const isChecked = selectedItems.has(item.id);
                    const checkbox = `<input type="checkbox" class="item-checkbox" ${
                        isChecked ? "checked" : ""
                    }>`;

                    return `
                    <div class="cart-item" data-id="${item.id}" data-price="${
                        item.price
                    }">
                        ${checkbox}
                        <div class="cart-item__image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item__content">
                            <h3 class="cart-item__title">${item.name}</h3>
                            <div class="cart-item__price">${formatPrice(
                                item.price
                            )}</div>
                            <div class="cart-item__quantity">
                                ${
                                    isOutOfStock
                                        ? '<span class="out-of-stock">Hết hàng</span>'
                                        : `<button class="quantity-btn minus" onclick="updateQuantity('${item.id}', -1)">-</button>
                                    <input type="number" value="${item.quantity}" min="1" max="${product.quantity}" 
                                           class="quantity-input" onchange="handleQuantityInput(this, '${item.id}')">
                                    <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>`
                                }
                            </div>
                        </div>
                        <button class="cart-item__remove" onclick="removeFromCart('${
                            item.id
                        }')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                })
                .join("");

            // Thêm phân trang nếu cần
            if (totalPages > 1) {
                cartItems.insertAdjacentHTML(
                    "beforeend",
                    `
                    <div class="pagination">
                        ${Array.from({ length: totalPages }, (_, i) => i + 1)
                            .map(
                                (page) => `
                            <button class="pagination-btn ${
                                page === cartCurrentPage ? "active" : ""
                            }"
                                    onclick="changeCartPage(${page})">
                                ${page}
                            </button>
                        `
                            )
                            .join("")}
                    </div>
                `
                );
            }

            // Thêm event listener cho checkboxes
            document.querySelectorAll(".item-checkbox").forEach((checkbox) => {
                checkbox.addEventListener("change", function () {
                    const itemId = this.closest(".cart-item").dataset.id;
                    if (this.checked) {
                        selectedItems.add(itemId);
                    } else {
                        selectedItems.delete(itemId);
                    }
                    saveSelectedItems();
                    updateSelectedTotal();
                });
            });

            // Cập nhật tổng tiền ngay sau khi render nếu có sản phẩm đã chọn
            if (selectedItems.size > 0) {
                updateSelectedTotal();
            }
        }
        hideLoading();
    }, 500);
}

// Cập nhật hàm updateQuantity
function updateQuantity(productId, change) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const cartKey = `cart_${user.id}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const product = getProductById(productId);

    if (!product) return;

    const cartItem = cart.find((item) => item.id === productId);
    if (cartItem) {
        const newQuantity = cartItem.quantity + parseInt(change);

        if (newQuantity >= 1 && newQuantity <= product.quantity) {
            cartItem.quantity = newQuantity;
            localStorage.setItem(cartKey, JSON.stringify(cart));

            // Cập nhật UI ngay lập tức
            const quantityInput = document.querySelector(
                `[data-id="${productId}"] .quantity-input`
            );
            if (quantityInput) {
                quantityInput.value = newQuantity;
            }

            // Cập nhật tổng tiền
            updateSelectedTotal();
            showToast("Đã cập nhật số lượng", "success");
        } else if (newQuantity > product.quantity) {
            showToast("Số lượng vượt quá tồn kho", "error");
        } else if (newQuantity < 1) {
            showToast("Số lượng tối thiểu là 1", "error");
        }
    }
}

// Thêm xử lý cho input số lượng
function handleQuantityInput(input, productId) {
    const newQuantity = parseInt(input.value);
    const product = getProductById(productId);

    if (isNaN(newQuantity) || newQuantity < 1) {
        input.value = 1;
        return;
    }

    if (newQuantity > product.quantity) {
        input.value = product.quantity;
        showToast("Số lượng vượt quá tồn kho", "error");
        return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const cartKey = `cart_${user.id}`;
    let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const cartItem = cart.find((item) => item.id === productId);

    if (cartItem) {
        cartItem.quantity = newQuantity;
        localStorage.setItem(cartKey, JSON.stringify(cart));
        updateSelectedTotal();
    }
}

// Cập nhật UI hiển thị nút thêm vào giỏ hàng
function updateAddToCartButton(product) {
    const addToCartBtns = document.querySelectorAll(
        `[data-id="${product.id}"] .add-to-cart-btn`
    );
    addToCartBtns.forEach((btn) => {
        if (product.quantity <= 0) {
            btn.textContent = "Hết hàng";
            btn.disabled = true;
            btn.classList.add("btn--disabled");
        }
    });
}

// Thêm hàm calculateTotal
function calculateTotal(items) {
    let subtotal = items.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    // Thêm phí vận chuyển (30,000đ)
    const shippingFee = 30000;
    return subtotal + shippingFee;
}

// Sửa lại hàm handleCheckout
function handleCheckout() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        showToast("Vui lòng đăng nhập để thanh toán", "error");
        return;
    }

    const cartKey = `cart_${user.id}`;
    const cart = JSON.parse(localStorage.getItem(cartKey)) || [];

    // Lấy tất cả sản phẩm đã chọn từ selectedItems
    const selectedProducts = cart.filter((item) => selectedItems.has(item.id));

    if (selectedProducts.length === 0) {
        showToast("Vui lòng chọn sản phẩm để thanh toán", "error");
        return;
    }

    // Tính tổng tiền sản phẩm
    const subtotal = selectedProducts.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    const orderData = {
        items: selectedProducts,
        subtotal: subtotal,
        shippingFee: 30000,
        total: subtotal + 30000, // Tổng tiền bao gồm phí vận chuyển
    };

    localStorage.setItem(`order_${user.id}`, JSON.stringify(orderData));
    // Xóa trạng thái checkbox đã lưu
    localStorage.removeItem(`selectedItems_${user.id}`);
    selectedItems.clear();
    window.location.href = "/checkout.html";
}

// Gọi updateCartCount khi load trang và sau khi đăng nhập
document.addEventListener("DOMContentLoaded", updateCartCount);

// Load cart khi trang được load
document.addEventListener("DOMContentLoaded", () => {
    showLoading();
    setTimeout(() => {
        loadSelectedItems(); // Load trạng thái checkbox và tính tổng tiền
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
    if (e.target.classList.contains("item-checkbox")) {
        updateSelectedTotal();
    }
});

// Sửa lại hàm updateSelectedTotal
function updateSelectedTotal() {
    const checkboxes = document.querySelectorAll(".item-checkbox:checked");
    const checkoutBtn = document.querySelector(".checkout-btn");
    let subtotal = 0;

    // Nếu không có checkbox được chọn nhưng có selectedItems
    if (checkboxes.length === 0 && selectedItems.size > 0) {
        const cart = getCart();
        subtotal = cart
            .filter((item) => selectedItems.has(item.id))
            .reduce((total, item) => total + item.price * item.quantity, 0);
    } else {
        checkboxes.forEach((checkbox) => {
            const cartItem = checkbox.closest(".cart-item");
            const price = parseFloat(cartItem.dataset.price);
            const quantity = parseInt(
                cartItem.querySelector(".quantity-input").value
            );
            subtotal += price * quantity;
        });
    }

    // Enable/disable nút thanh toán
    if (checkoutBtn) {
        checkoutBtn.disabled =
            checkboxes.length === 0 && selectedItems.size === 0;
    }

    // Cập nhật hiển thị tổng tiền
    const subtotalElement = document.getElementById("cartSubtotal");
    const totalElement = document.getElementById("cartTotal");
    const shippingFee = 30000;

    if (subtotalElement && totalElement) {
        subtotalElement.textContent = formatPrice(subtotal);
        totalElement.textContent = formatPrice(subtotal + shippingFee);
    }
}

function changeCartPage(page) {
    cartCurrentPage = page;
    renderCart();
    scrollToTop(); // Thêm cuộn lên đầu trang
}

// Thêm hàm scrollToTop
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

// Thêm hàm getCart
function getCart() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return [];

    const cartKey = `cart_${user.id}`;
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}
