function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Giả lập API đăng nhập
    if (email && password) {
        const userData = {
            id: Date.now().toString(), // Tạo userId unique
            email: email,
            name: email.split("@")[0],
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        showToast("Đăng nhập thành công!");
        setTimeout(() => {
            window.location.href = "/";
        }, 1000);
    } else {
        showToast("Vui lòng nhập đầy đủ thông tin!", "error");
    }
} 