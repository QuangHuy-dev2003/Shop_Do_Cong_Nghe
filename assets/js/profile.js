document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        window.location.href = "/login.html";
        return;
    }

    // Show loader
    showLoading();

    // Load user data
    loadUserProfile(user);

    // Handle form submissions
    const profileForm = document.getElementById("profileForm");
    const passwordForm = document.getElementById("passwordForm");

    profileForm.addEventListener("submit", handleProfileUpdate);
    passwordForm.addEventListener("submit", handlePasswordChange);

    // Hide loader
    setTimeout(hideLoading, 1000);
});

function loadUserProfile(user) {
    // Tạo avatar text từ tên người dùng
    const name = user.name || "User Name";
    const initials = name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // Cập nhật avatar
    const avatarImg = document.getElementById("userAvatar");
    if (avatarImg) {
        // Kiểm tra xem avatarImg có tồn tại không
        const avatarContainer = document.createElement("div");
        avatarContainer.className = "avatar-text";
        avatarContainer.style.backgroundColor = getRandomColor(name);
        avatarContainer.textContent = initials;
        avatarImg.parentNode.replaceChild(avatarContainer, avatarImg);
    }

    // Cập nhật thông tin khác
    document.getElementById("userName").textContent = name;
    document.getElementById("userEmail").textContent = user.email;

    // Fill form fields
    document.getElementById("fullName").value = name;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("address").value = user.address || "";
}

function handleProfileUpdate(e) {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
        showToast("Không tìm thấy thông tin người dùng", "error");
        return;
    }

    // Lấy danh sách users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    console.log(userIndex);

    if (userIndex === -1) {
        showToast("Không tìm thấy tài khoản trong hệ thống", "error");
        return;
    }

    const formData = new FormData(e.target);

    // Cập nhật thông tin user
    const updatedUser = {
        ...users[userIndex],
        name: formData.get("fullName"),
        phone: formData.get("phone"),
        address: formData.get("address"),
    };

    // Cập nhật trong mảng users
    users[userIndex] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users));

    // Cập nhật thông tin user hiện tại
    localStorage.setItem("user", JSON.stringify(updatedUser));

    showToast("Cập nhật thông tin thành công", "success");
    setTimeout(() => {
        location.reload();
    }, 1000);
    // Cập nhật lại giao diện
    loadUserProfile(updatedUser);
}

function handlePasswordChange(e) {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
        showToast("Không tìm thấy thông tin người dùng", "error");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    console.log(userIndex);
    if (userIndex === -1) {
        showToast("Không tìm thấy tài khoản trong hệ thống", "error");
        return;
    }

    const formData = new FormData(e.target);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    // Kiểm tra mật khẩu hiện tại
    if (currentPassword !== users[userIndex].password) {
        showToast("Mật khẩu hiện tại không đúng", "error");
        return;
    }

    // Kiểm tra mật khẩu mới và xác nhận
    if (newPassword !== confirmPassword) {
        showToast("Mật khẩu mới không khớp", "error");
        return;
    }

    // Validate mật khẩu mới
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
        showToast(
            "Mật khẩu mới phải có ít nhất 6 ký tự, chữ cái đầu viết hoa và phải có số",
            "error"
        );
        return;
    }

    // Cập nhật mật khẩu
    users[userIndex].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));

    // Cập nhật user hiện tại
    currentUser.password = newPassword;
    localStorage.setItem("user", JSON.stringify(currentUser));

    e.target.reset();
    showToast("Đổi mật khẩu thành công", "success");
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Tạo màu ngẫu nhiên nhưng ổn định cho mỗi tên
function getRandomColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
}
