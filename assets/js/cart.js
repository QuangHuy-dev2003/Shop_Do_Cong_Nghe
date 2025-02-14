// Khởi tạo giỏ hàng từ localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Thêm sản phẩm vào giỏ hàng
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1,
            price: product.price,
            name: product.name,
            image: product.image
        });
    }
    
    // Lưu giỏ hàng vào localStorage
    saveCart();
    
    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount();
    
    // Hiển thị thông báo
    showToast('Đã thêm sản phẩm vào giỏ hàng');
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartQuantity(productId, quantity) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        if (quantity > 0) {
            cartItem.quantity = quantity;
        } else {
            // Xóa sản phẩm khỏi giỏ hàng nếu số lượng = 0
            cart = cart.filter(item => item.id !== productId);
        }
        saveCart();
        renderCart();
        updateCartTotal();
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    updateCartTotal();
    showToast('Đã xóa sản phẩm khỏi giỏ hàng');
}

// Lưu giỏ hàng vào localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    const cartCount = document.querySelector('.header__cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Tính tổng tiền giỏ hàng
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Cập nhật hiển thị tổng tiền
function updateCartTotal() {
    const subtotalElement = document.getElementById('cartSubtotal');
    const totalElement = document.getElementById('cartTotal');
    
    if (subtotalElement && totalElement) {
        const subtotal = calculateCartTotal();
        const shipping = subtotal > 500000 ? 0 : 30000; // Miễn phí ship cho đơn > 500k
        const total = subtotal + shipping;
        
        subtotalElement.textContent = formatPrice(subtotal);
        totalElement.textContent = formatPrice(total);
    }
}

// Render giỏ hàng
function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Giỏ hàng trống</p>
                <a href="/" class="btn btn--primary">Tiếp tục mua sắm</a>
            </div>
        `;
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item__image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item__content">
                <h3 class="cart-item__title">${item.name}</h3>
                <div class="cart-item__price">${formatPrice(item.price)}</div>
                <div class="cart-item__quantity">
                    <button class="quantity-btn minus">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                    <button class="quantity-btn plus">+</button>
                </div>
            </div>
            <button class="cart-item__remove">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    // Cập nhật tổng tiền
    updateCartTotal();
}

// Xử lý đặt hàng
function handleCheckout(event) {
    event.preventDefault();
    
    const form = event.target;
    const orderData = {
        items: cart,
        customer: {
            name: form.name.value,
            phone: form.phone.value,
            address: form.address.value
        },
        total: calculateCartTotal()
    };
    
    // Tạo mã đơn hàng
    const orderId = 'DH' + Date.now();
    
    // Lưu đơn hàng vào localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push({
        id: orderId,
        ...orderData,
        date: new Date().toISOString()
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Xóa giỏ hàng
    cart = [];
    saveCart();
    
    // Chuyển đến trang cảm ơn
    window.location.href = `/thank-you.html?orderId=${orderId}`;
} 