// Thêm hàm getProductById
function getProductById(productId) {
    const allProducts = getAllProducts();
    return allProducts.find(p => p.id === productId);
}

// Thêm hàm formatPrice
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Thêm hàm getAllProducts
function getAllProducts() {
    if (typeof products === 'undefined') return [];
    
    const allProducts = [];
    const categories = ['laptops', 'smartwatches', 'headphones'];
    
    categories.forEach(category => {
        if (products[category]) {
            allProducts.push(...products[category]);
        }
    });
    
    return allProducts;
}

document.addEventListener('DOMContentLoaded', () => {
    // Đảm bảo products.js đã được load
    if (typeof products === 'undefined') {
        const script = document.createElement('script');
        script.src = '/assets/js/products.js';
        script.onload = initCheckout;
        document.head.appendChild(script);
    } else {
        initCheckout();
    }
});

function initCheckout() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    const orderData = JSON.parse(localStorage.getItem(`order_${user.id}`));
    if (!orderData) {
        window.location.href = '/cart.html';
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
    document.getElementById('checkoutForm').addEventListener('submit', handleOrder);
}

// Thêm hàm điền thông tin người dùng
function fillUserInfo(user) {
    // Lấy thông tin chi tiết người dùng từ localStorage nếu có
    const userDetails = JSON.parse(localStorage.getItem(`userDetails_${user.id}`)) || {};
    
    document.getElementById('name').value = user.name || userDetails.name || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('address').value = user.address || '';
}

// Xử lý khi người dùng rời trang
window.addEventListener('beforeunload', (e) => {
    if (window.location.pathname.includes('checkout.html')) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// Xử lý khi người dùng xác nhận rời trang
window.addEventListener('unload', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        localStorage.removeItem(`order_${user.id}`);
    }
});

// Thêm nút quay lại
function handleBack() {
    if (confirm('Bạn có chắc chắn muốn hủy thanh toán?')) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            localStorage.removeItem(`order_${user.id}`);
        }
        window.location.href = '/cart.html';
    }
}

function renderOrderSummary(items, total) {
    const orderItemsContainer = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');

    // Hiển thị các sản phẩm đã chọn
    orderItemsContainer.innerHTML = items.map(item => {
        const product = getProductById(item.id);
        if (!product) return '';
        
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
    }).join('');

    // Hiển thị tổng tiền
    orderTotal.textContent = formatPrice(total);
}

function handleOrder(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const formData = new FormData(e.target);
    
    // Lưu thông tin người dùng để lần sau tự động điền
    const userDetails = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address')
    };
    localStorage.setItem(`userDetails_${user.id}`, JSON.stringify(userDetails));

    // Xử lý đặt hàng...
    showLoading();
    setTimeout(() => {
        const orderData = {
            items: JSON.parse(localStorage.getItem(`order_${user.id}`)).items,
            total: JSON.parse(localStorage.getItem(`order_${user.id}`)).total,
            customer: userDetails,
            userId: user.id,
            date: new Date().toISOString()
        };

        // Lưu đơn hàng
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Xóa sản phẩm đã đặt khỏi giỏ hàng
        const cartKey = `cart_${user.id}`;
        let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
        orderData.items.forEach(item => {
            cart = cart.filter(cartItem => cartItem.id !== item.id);
        });
        localStorage.setItem(cartKey, JSON.stringify(cart));

        // Xóa dữ liệu checkout
        localStorage.removeItem(`order_${user.id}`);

        hideLoading();
        // Chuyển hướng đến trang cảm ơn
        window.location.href = '/thank-you.html';
    }, 1000);
} 