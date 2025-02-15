document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "/login.html";
        return;
    }

    const orderList = document.getElementById("orderList");
    const noOrders = document.getElementById("noOrders");
    const pagination = document.getElementById("pagination");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    let currentPage = 1;
    const ordersPerPage = 5;
    let allOrders = [];

    // Load orders
    function loadOrders() {
        showLoading();
        const ordersKey = `orders_${user.id}`;
        allOrders = JSON.parse(localStorage.getItem(ordersKey)) || [];

        // Sắp xếp theo ID giảm dần
        allOrders.sort((a, b) => {
            const timeA = parseInt(a.id.split("_")[2]);
            const timeB = parseInt(b.id.split("_")[2]);
            return timeB - timeA;
        });

        if (!allOrders || allOrders.length === 0) {
            orderList.style.display = "none";
            pagination.style.display = "none";
            noOrders.style.display = "flex";
            noOrders.classList.add("fade-in");
        } else {
            noOrders.style.display = "none";
            orderList.style.display = "grid";
            displayOrders(currentPage);
            setupPagination();
        }
        hideLoading();
    }

    // Display orders for current page
    function displayOrders(page, filteredOrders = allOrders) {
        const start = (page - 1) * ordersPerPage;
        const end = start + ordersPerPage;
        const paginatedOrders = filteredOrders.slice(start, end);

        orderList.innerHTML = paginatedOrders
            .map(
                (order) => `
            <div class="order-card fade-in">
                <div class="order-card__header">
                    <div>
                        <div class="order-id">Mã đơn hàng: ${order.id}</div>
                        <div class="order-date">Ngày đặt: ${formatDate(
                            order.date
                        )}</div>
                    </div>
                    <div class="order-status status-${
                        order.status
                    }">${getStatusText(order.status)}</div>
                </div>
                <div class="order-card__items">
                    ${order.items
                        .slice(0, 2)
                        .map(
                            (item) => `
                        <div class="order-card__item">
                            <div class="item-info">
                                <img src="${item.image}" alt="${
                                item.name
                            }" class="item-image">
                                <div class="item-details">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-meta">
                                        <span class="item-quantity">Số lượng: ${
                                            item.quantity
                                        }</span>
                                        <span class="item-price">${formatPrice(
                                            item.price
                                        )}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                        )
                        .join("")}
                    ${
                        order.items.length > 2
                            ? `
                        <button class="view-details-btn" onclick="showOrderDetails('${
                            order.id
                        }')">
                            Xem thêm ${order.items.length - 2} sản phẩm khác
                        </button>
                    `
                            : ""
                    }
                </div>
                <div class="order-card__footer">
                    <div class="order-total">Tổng tiền: ${formatPrice(
                        order.total
                    )}</div>
                </div>
            </div>
        `
            )
            .join("");

        // Thêm hàm xử lý popup
        window.showOrderDetails = function (orderId) {
            const order = allOrders.find((o) => o.id === orderId);
            if (!order) return;

            const modalHtml = `
                <div class="modal-overlay" onclick="closeOrderDetails(event)">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Chi tiết đơn hàng #${order.id}</h3>
                            <button class="close-btn" onclick="closeOrderDetails(event)">×</button>
                        </div>
                        <div class="modal-body">
                            <div class="order-info">
                                <p>Ngày đặt: ${formatDate(order.date)}</p>
                                <p>Trạng thái: <span class="status-${
                                    order.status
                                }">${getStatusText(order.status)}</span></p>
                            </div>
                            <div class="customer-info">
                                <h4>Thông tin khách hàng</h4>
                                <p>Tên: ${order.customer.name}</p>
                                <p>SĐT: ${order.customer.phone}</p>
                                <p>Địa chỉ: ${order.customer.address}</p>
                            </div>
                            <div class="products-list">
                                <h4>Danh sách sản phẩm</h4>
                                ${order.items
                                    .map(
                                        (item) => `
                                    <div class="product-item">
                                        <img src="${item.image}" alt="${
                                            item.name
                                        }">
                                        <div class="product-details">
                                            <div class="product-name">${
                                                item.name
                                            }</div>
                                            <div class="product-meta">
                                                <span>Số lượng: ${
                                                    item.quantity
                                                }</span>
                                                <span>Giá: ${formatPrice(
                                                    item.price
                                                )}</span>
                                            </div>
                                        </div>
                                    </div>
                                `
                                    )
                                    .join("")}
                            </div>
                            <div class="order-summary">
                                <div class="total">Tổng tiền: ${formatPrice(
                                    order.total
                                )}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML("beforeend", modalHtml);
        };

        window.closeOrderDetails = function (event) {
            if (event) {
                event.stopPropagation();
            }
            const modal = document.querySelector(".modal-overlay");
            if (modal) {
                modal.remove();
            }
        };
    }

    // Setup pagination
    function setupPagination() {
        const pageCount = Math.ceil(allOrders.length / ordersPerPage);
        const pageNumbers = document.getElementById("pageNumbers");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");

        pageNumbers.innerHTML = "";
        for (let i = 1; i <= pageCount; i++) {
            const button = document.createElement("div");
            button.className = `page-number ${
                currentPage === i ? "active" : ""
            }`;
            button.textContent = i;
            button.addEventListener("click", () => {
                currentPage = i;
                displayOrders(currentPage);
                setupPagination();
                scrollToTop();
            });
            pageNumbers.appendChild(button);
        }

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === pageCount;

        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                displayOrders(currentPage);
                setupPagination();
                scrollToTop();
            }
        });

        nextBtn.addEventListener("click", () => {
            if (currentPage < pageCount) {
                currentPage++;
                displayOrders(currentPage);
                setupPagination();
                scrollToTop();
            }
        });

        pagination.style.display = pageCount > 1 ? "flex" : "none";
    }

    // Search functionality
    searchButton.addEventListener("click", () => {
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) return;

        showLoading();
        setTimeout(() => {
            const filteredOrders = allOrders.filter((order) =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredOrders.length === 0) {
                orderList.innerHTML = `
                    <div class="no-results">
                        <p>Không tìm thấy đơn hàng với mã "${searchTerm}"</p>
                    </div>
                `;
                pagination.style.display = "none";
            } else {
                currentPage = 1;
                displayOrders(currentPage, filteredOrders);
                setupPagination();
            }
            hideLoading();
        }, 500);
    });

    // Các hàm hỗ trợ
    function formatDate(dateString) {
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("vi-VN", options);
    }

    function formatPrice(price) {
        return price.toLocaleString("vi-VN") + "đ";
    }

    function getStatusText(status) {
        const statusMap = {
            pending: "Đang xử lý",
            processing: "Đang vận chuyển",
            completed: "Đã giao hàng",
            cancelled: "Đã hủy",
        };
        return statusMap[status] || status;
    }

    // Thêm hàm scrollToTop
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // Initial load
    loadOrders();
});
