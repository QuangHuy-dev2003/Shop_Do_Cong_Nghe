// Kiểm tra trạng thái đăng nhập
function checkAuth() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user : null;
}

// Xử lý đăng nhập
async function handleLogin(event) {
    event.preventDefault();

    const spinner = document.getElementById("loadingSpinner");
    spinner.style.display = "block";

    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
        // Giả lập delay API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(
            (u) => u.email === email && u.password === password
        );

        if (user) {
            // Lưu thông tin user vào localStorage (không lưu password)
            const userInfo = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || "USER",
            };
            localStorage.setItem("user", JSON.stringify(userInfo));

            showToast("Đăng nhập thành công!");
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } else {
            showToast("Tài khoản hoặc mật khẩu không chính xác", "error");
        }
    } catch (error) {
        showToast("Có lỗi xảy ra, vui lòng thử lại", "error");
    } finally {
        spinner.style.display = "none";
    }
}

// Hàm tạo ID ngẫu nhiên
function generateUserId() {
    return "user_" + Math.random().toString(36).substr(2, 9);
}

// Xử lý đăng ký
async function handleRegister(event) {
    event.preventDefault();

    const spinner = document.getElementById("loadingSpinner");
    const overlay = document.getElementById("loadingOverlay");
    spinner.style.display = "block";
    overlay.style.display = "block";

    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const phone = form.phone.value;
    const address = form.address.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    try {
        // Kiểm tra mật khẩu xác nhận
        if (password !== confirmPassword) {
            showToast("Mật khẩu xác nhận không khớp", "error");
            return;
        }

        // Giả lập delay API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Kiểm tra email đã tồn tại
        if (users.some((u) => u.email === email)) {
            showToast("Email đã được sử dụng", "error");
            return;
        }

        // Thêm user mới với id
        const newUser = {
            id: generateUserId(),
            name,
            email,
            phone,
            address,
            password,
            role: "USER",
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        showToast("Đăng ký thành công!");
        setTimeout(() => {
            window.location.href = "/login.html";
        }, 1000);
    } catch (error) {
        showToast("Có lỗi xảy ra, vui lòng thử lại", "error");
    } finally {
        spinner.style.display = "none";
        overlay.style.display = "none";
    }
}

// Xử lý đăng xuất
function handleLogout() {
    localStorage.removeItem("user");
    window.location.href = "/";
}

// Cập nhật UI theo trạng thái đăng nhập
function updateAuthUI() {
    const user = checkAuth();
    const userDropdown = document.querySelector(".header__user-dropdown");

    if (userDropdown) {
        if (user) {
            userDropdown.innerHTML = `
                <span class="header__user-name">${user.name}</span>
                <a href="/profile" class="header__user-link">Tài khoản của tôi</a>
                <button class="header__user-link" onclick="handleLogout()">Đăng xuất</button>
            `;
        } else {
            userDropdown.innerHTML = `
                <a href="/login" class="header__user-link">Đăng nhập</a>
                <a href="/register" class="header__user-link">Đăng ký</a>
            `;
        }
    }
}

// Kiểm tra form
function validateForm(form) {
    const email = form.email.value;
    const password = form.password.value;

    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
        showToast("Email không hợp lệ", "error");
        return false;
    }

    if (password.length < 6) {
        showToast("Mật khẩu phải có ít nhất 6 ký tự", "error");
        return false;
    }

    return true;
}

// Khởi tạo các event listener
document.addEventListener("DOMContentLoaded", function () {
    // Hiện loading khi trang đang tải
    const spinner = document.getElementById("loadingSpinner");
    spinner.style.display = "block";

    // Khởi tạo tài khoản admin nếu chưa có
    initAdminAccount();

    // Ẩn loading sau 1.5 giây
    setTimeout(() => {
        spinner.style.display = "none";
    }, 1500);

    updateAuthUI();

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegister);
    }
});

// Khởi tạo tài khoản admin
function initAdminAccount() {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Kiểm tra xem đã có tài khoản admin chưa
    const adminExists = users.some((user) => user.role === "ADMIN");

    if (!adminExists) {
        users.push({
            id: "admin_" + Math.random().toString(36).substr(2, 9),
            name: "Administrator",
            email: "admin",
            password: "admin",
            role: "ADMIN",
        });
        localStorage.setItem("users", JSON.stringify(users));
    }
}
