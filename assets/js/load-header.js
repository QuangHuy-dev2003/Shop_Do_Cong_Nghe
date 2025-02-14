// Hàm load header
function loadHeader() {
    return fetch("./components/header.html")
        .then((response) => response.text())
        .then((data) => {
            document.getElementById("header").innerHTML = data;
            // Load header.js sau khi header đã được load
            const script = document.createElement("script");
            script.src = "./assets/js/header.js";
            document.body.appendChild(script);
        })
        .catch((error) => console.error("Error loading header:", error));
}

// Load header khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", loadHeader); 