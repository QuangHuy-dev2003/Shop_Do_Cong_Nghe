// Thêm hàm getProductById
function getProductById(productId) {
    const allProducts = getAllProducts();
    return allProducts.find((p) => p.id === productId);
}

// Thêm hàm formatPrice
function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}

// Thêm hàm getAllProducts
function getAllProducts() {
    if (typeof products === "undefined") return [];

    const allProducts = [];
    const categories = ["laptops", "smartwatches", "headphones"];

    categories.forEach((category) => {
        if (products[category]) {
            allProducts.push(...products[category]);
        }
    });

    return allProducts;
}

document.addEventListener("DOMContentLoaded", () => {
    // Đảm bảo products.js đã được load
    if (typeof products === "undefined") {
        const script = document.createElement("script");
        script.src = "/assets/js/products.js";
        script.onload = initCheckout;
        document.head.appendChild(script);
    } else {
        initCheckout();
    }
});

function initCheckout() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "/login.html";
        return;
    }

    const orderData = JSON.parse(localStorage.getItem(`order_${user.id}`));
    if (!orderData) {
        window.location.href = "/cart.html";
        return;
    }

    showLoading();
    setTimeout(() => {
        renderOrderSummary(orderData.items, orderData.total);
        // Tự động điền thông tin người dùng
        fillUserInfo(user);
        hideLoading();
    }, 1000);

    // Xử lý form thanh toán
    document
        .getElementById("checkoutForm")
        .addEventListener("submit", handleOrder);
}

// Thêm hàm điền thông tin người dùng
function fillUserInfo(user) {
    // Lấy thông tin chi tiết người dùng từ localStorage nếu có

    document.getElementById("name").value = user.name || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("address").value = user.address || "";
}

// Thêm hàm hiển thị popup xác nhận
function showConfirmModal(message, onConfirm) {
    const modalHtml = `
        <div class="modal-overlay" id="confirmModal">
            <div class="modal">
                <h3>Xác nhận</h3>
                <p>${message}</p>
                <div class="modal-buttons">
                    <button class="btn btn--secondary" onclick="hideConfirmModal()">
                        Hủy
                    </button>
                    <button class="btn btn--primary" onclick="confirmAction()">
                        Đồng ý
                    </button>
                </div>
            </div>
        </div>
    `;

    // Thêm modal vào body
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    // Lưu callback để sử dụng sau
    window.confirmCallback = onConfirm;
}

function hideConfirmModal() {
    const modal = document.getElementById("confirmModal");
    if (modal) {
        modal.remove();
    }
}

function confirmAction() {
    hideConfirmModal();
    if (window.confirmCallback) {
        window.confirmCallback();
    }
}

// Sửa lại hàm handleBack
function handleBack() {
    showConfirmModal("Bạn có chắc chắn muốn hủy thanh toán?", () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            localStorage.removeItem(`order_${user.id}`);
        }
        window.location.href = "/cart.html";
    });
}

function renderOrderSummary(items, total) {
    const orderItemsContainer = document.getElementById("orderItems");
    const orderTotal = document.getElementById("orderTotal");

    // Hiển thị các sản phẩm đã chọn
    orderItemsContainer.innerHTML = items
        .map((item) => {
            const product = getProductById(item.id);
            if (!product) return "";

            return `
            <div class="order-item">
                <div class="order-item__image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="order-item__info">
                    <h3>${product.name}</h3>
                    <div class="order-item__price">
                        ${formatPrice(item.price)} x ${item.quantity}
                    </div>
                </div>
            </div>
        `;
        })
        .join("");

    // Hiển thị tổng tiền
    orderTotal.textContent = formatPrice(total);
}

// Xóa các event listener không cần thiết
window.onbeforeunload = null;

// Thêm hàm tạo mã đơn hàng ngẫu nhiên
function generateOrderId() {
    const prefix = "DH";
    let randomNum;
    const existingOrders = getAllOrders(); // Lấy tất cả đơn hàng hiện có

    do {
        // Tạo số ngẫu nhiên 6 chữ số
        randomNum = Math.floor(100000 + Math.random() * 900000);
    } while (
        existingOrders.some((order) => order.id === `${prefix}${randomNum}`)
    );

    return `${prefix}${randomNum}`;
}

// Thêm hàm lấy tất cả đơn hàng
function getAllOrders() {
    const allOrders = [];
    const users = JSON.parse(localStorage.getItem("users")) || [];

    users.forEach((user) => {
        const userOrders =
            JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
        allOrders.push(...userOrders);
    });

    return allOrders;
}

function handleOrder(e) {
    e.preventDefault();
    e.stopPropagation();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const formData = new FormData(e.target);
    const orderData = JSON.parse(localStorage.getItem(`order_${user.id}`));

    if (!orderData) {
        showToast("Không tìm thấy thông tin đơn hàng", "error");
        return;
    }

    // Kiểm tra thông tin bắt buộc
    const name = formData.get("name");
    const phone = formData.get("phone");
    const address = formData.get("address");

    if (!name || !phone || !address) {
        showToast("Vui lòng điền đầy đủ thông tin", "error");
        return;
    }

    // Lấy thông tin chi tiết sản phẩm
    const allProducts = getAllProducts();
    const itemsWithDetails = orderData.items.map((item) => {
        const product = allProducts.find((p) => p.id === item.id);
        return {
            ...item,
            name: product.name,
            image: product.image,
        };
    });

    showLoading();
    setTimeout(() => {
        const orderId = generateOrderId(); // Sử dụng hàm mới

        const newOrder = {
            id: orderId,
            items: itemsWithDetails,
            total: orderData.total,
            customer: {
                name: formData.get("name"),
                phone: formData.get("phone"),
                address: formData.get("address"),
            },
            userId: user.id,
            status: "pending",
            date: new Date().toISOString(),
        };

        // Lưu đơn hàng
        const userOrders =
            JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
        userOrders.push(newOrder);
        localStorage.setItem(`orders_${user.id}`, JSON.stringify(userOrders));

        // Xóa chỉ những sản phẩm đã đặt khỏi giỏ hàng
        const cartKey = `cart_${user.id}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        const orderedItemIds = new Set(orderData.items.map((item) => item.id));
        cart = cart.filter((cartItem) => !orderedItemIds.has(cartItem.id));
        localStorage.setItem(cartKey, JSON.stringify(cart));

        // Xóa dữ liệu đơn hàng tạm thời
        localStorage.removeItem(`order_${user.id}`);

        hideLoading();
        window.location.href = `/thank-you.html?orderId=${orderId}`;
    }, 1000);
}

// Xóa event listener cũ và thêm mới
document
    .getElementById("checkoutForm")
    .removeEventListener("submit", handleOrder);
document.getElementById("checkoutForm").addEventListener("submit", handleOrder);

// Thêm hàm getCart
function getCart() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return [];

    const cartKey = `cart_${user.id}`;
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function saveOrder(orderData) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    // Thêm thông tin người dùng vào order
    orderData.userEmail = user.email;
    orderData.date = new Date();
    orderData.id = generateOrderId();
    orderData.status = "pending";

    // Lấy danh sách orders hiện tại
    const orders =
        JSON.parse(localStorage.getItem(`orders_${user.email}`)) || [];

    // Thêm order mới vào đầu danh sách
    orders.unshift(orderData);

    // Lưu lại vào localStorage
    localStorage.setItem(`orders_${user.email}`, JSON.stringify(orders));
}
