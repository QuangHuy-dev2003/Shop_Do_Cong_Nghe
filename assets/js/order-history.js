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
    let orders = [];

    // Load orders
    function loadOrders() {
        showLoading();
        const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
        orders = allOrders.filter((order) => order.userId === user.id);

        if (orders.length === 0) {
            noOrders.style.display = "block";
            orderList.style.display = "none";
            pagination.style.display = "none";
        } else {
            noOrders.style.display = "none";
            orderList.style.display = "grid";
            displayOrders(currentPage);
            setupPagination();
        }
        hideLoading();
    }

    // Display orders for current page
    function displayOrders(page, filteredOrders = orders) {
        const start = (page - 1) * ordersPerPage;
        const end = start + ordersPerPage;
        const paginatedOrders = filteredOrders.slice(start, end);

        orderList.innerHTML = paginatedOrders
            .map(
                (order) => `
            <div class="order-card">
                <div class="order-card__header">
                    <div>
                        <div>Mã đơn hàng: ${order.id}</div>
                        <div>Ngày đặt: ${new Date(
                            order.date
                        ).toLocaleDateString("vi-VN")}</div>
                    </div>
                    <div class="order-status ${order.status}">${
                    order.status
                }</div>
                </div>
                <div class="order-card__items">
                    ${order.items
                        .map(
                            (item) => `
                        <div class="order-card__item">
                            Sản phẩm ID: ${item.id} - Số lượng: ${
                                item.quantity
                            } - Giá: ${item.price.toLocaleString("vi-VN")}đ
                        </div>
                    `
                        )
                        .join("")}
                </div>
            </div>
        `
            )
            .join("");
    }

    // Setup pagination
    function setupPagination() {
        const pageCount = Math.ceil(orders.length / ordersPerPage);
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
            }
        });

        nextBtn.addEventListener("click", () => {
            if (currentPage < pageCount) {
                currentPage++;
                displayOrders(currentPage);
                setupPagination();
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
            const filteredOrders = orders.filter((order) =>
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

    // Initial load
    loadOrders();
});

function formatDate(date) {
    return new Date(date).toLocaleDateString("vi-VN");
}

function getStatusText(status) {
    const statusMap = {
        pending: "Đang xử lý",
        completed: "Đã giao hàng",
        cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
}
