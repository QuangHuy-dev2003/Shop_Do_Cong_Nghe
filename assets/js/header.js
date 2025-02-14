console.log("Header.js loaded"); // Kiểm tra file có được load không

// Hàm cập nhật menu user
function updateUserMenu() {
    console.log("updateUserMenu called"); // Kiểm tra hàm có được gọi không

    try {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("LocalStorage user data:", localStorage.getItem("user")); // Kiểm tra dữ liệu thô từ localStorage
        console.log("Parsed user data:", user); // Kiểm tra dữ liệu sau khi parse

        const userDropdown = document.querySelector(".header__user-dropdown");
        console.log("Dropdown element:", userDropdown); // Kiểm tra element dropdown

        if (!userDropdown) {
            console.error("Dropdown element not found");
            return;
        }

        if (user) {
            console.log("User is logged in:", user.name);
            // Người dùng đã đăng nhập
            userDropdown.innerHTML = `
                <div class="header__user-info">
                    <span class="header__user-greeting">Xin chào, ${user.name}</span>
                </div>
                <a href="/profile" class="header__user-link">
                    <i class="fas fa-user-edit"></i>
                    Cập nhật thông tin
                </a>
                <a href="/purchase-history" class="header__user-link">
                    <i class="fas fa-history"></i>
                    Lịch sử mua hàng
                </a>
                <a href="#!" class="header__user-link" onclick="handleLogout()">
                    <i class="fas fa-sign-out-alt"></i>
                    Đăng xuất
                </a>
            `;
        } else {
            console.log("No user logged in");
            // Chưa đăng nhập
            userDropdown.innerHTML = `
                <a href="./login.html" class="header__user-link">
                    <i class="fas fa-sign-in-alt"></i>
                    Đăng nhập
                </a>
                <a href="./register.html" class="header__user-link">
                    <i class="fas fa-user-plus"></i>
                    Đăng ký
                </a>
            `;
        }
    } catch (error) {
        console.error("Error in updateUserMenu:", error);
    }
}

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
    } catch (error) {
        console.error("Error in initializeHeader:", error);
    }
}

// Đăng ký event listener cho DOMContentLoaded
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeHeader);
} else {
    // DOM đã load xong
    initializeHeader();
}
