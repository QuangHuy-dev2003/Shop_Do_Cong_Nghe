console.log("Header.js loaded"); // Kiểm tra file có được load không

// Hàm cập nhật menu user
function updateUserMenu() {
    console.log("updateUserMenu called"); // Kiểm tra hàm có được gọi không

    try {
        const userDropdown = document.querySelector(".header__user-dropdown");
        const userData = localStorage.getItem("user");

        if (userData) {
            const user = JSON.parse(userData);
            console.log(
                "LocalStorage user data:",
                localStorage.getItem("user")
            ); // Kiểm tra dữ liệu thô từ localStorage
            console.log("Parsed user data:", user); // Kiểm tra dữ liệu sau khi parse

            console.log("User is logged in:", user.name);
            // Người dùng đã đăng nhập
            userDropdown.innerHTML = `
                <div class="header__user-info">
                    <div class="header__user-greeting">Xin chào, ${user.name}</div>
                </div>
                <a href="/profile.html" class="header__user-link">
                    <i class="fas fa-user-circle"></i>
                    Thông tin tài khoản
                </a>
                <a href="/order-history.html" class="header__user-link">
                    <i class="fas fa-history"></i>
                    Lịch sử mua hàng
                </a>
                <a href="#" class="header__user-link" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                    Đăng xuất
                </a>
            `;

            // Xử lý đăng xuất
            const logoutBtn = document.getElementById("logoutBtn");
            logoutBtn?.addEventListener("click", (e) => {
                e.preventDefault();
                logout();
            });
        } else {
            console.log("No user logged in");
            // Chưa đăng nhập
            userDropdown.innerHTML = `
                <a href="/login.html" class="header__user-link">
                    <i class="fas fa-sign-in-alt"></i>
                    Đăng nhập
                </a>
                <a href="/register.html" class="header__user-link">
                    <i class="fas fa-user-plus"></i>
                    Đăng ký
                </a>
            `;
        }
    } catch (error) {
        console.error("Error in updateUserMenu:", error);
    }
}

// Thêm hàm loadUserCart vào header.js
function loadUserCart() {
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

// Thêm event listener cho đăng nhập thành công
document.addEventListener('loginSuccess', (e) => {
    const user = e.detail;
    if (user) {
        loadUserCart(); // Load lại giỏ hàng khi đăng nhập
    }
});

// Đảm bảo code chỉ chạy sau khi DOM đã load
function initializeHeader() {
    console.log("Initializing header"); // Kiểm tra initialization

    try {
        const userIcon = document.querySelector(".header__user-icon");
        console.log("User icon element:", userIcon); // Kiểm tra element icon

        if (!userIcon) {
            console.error("User icon not found");
            return;
        }

        userIcon.addEventListener("click", function (e) {
            console.log("Icon clicked");
            const dropdown = document.querySelector(".header__user-dropdown");
            console.log("Dropdown on click:", dropdown);
            dropdown.classList.toggle("show");
            e.stopPropagation();
        });

        document.addEventListener("click", function () {
            const dropdown = document.querySelector(".header__user-dropdown");
            if (dropdown && dropdown.classList.contains("show")) {
                dropdown.classList.remove("show");
            }
        });

        updateUserMenu();
        loadUserCart(); // Thêm dòng này
    } catch (error) {
        console.error("Error in initializeHeader:", error);
    }
}

// Thêm active menu
function setActiveMenu() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll(".header__nav-link");

    menuItems.forEach((item) => {
        item.classList.remove("active");
        if (item.getAttribute("href") === currentPath) {
            item.classList.add("active");
        }
    });
}

// Đăng ký event listener cho DOMContentLoaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initializeHeader();
        setActiveMenu();
    });
} else {
    // DOM đã load xong
    initializeHeader();
    setActiveMenu();
}
