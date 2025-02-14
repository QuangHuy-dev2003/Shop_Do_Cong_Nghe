document.addEventListener('DOMContentLoaded', function() {
    // Lấy ID sản phẩm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        window.location.href = '/';
        return;
    }
    
    // Hiển thị loading
    showLoading();
    
    // Lấy thông tin sản phẩm
    const product = getProductById(productId);
    if (!product) {
        window.location.href = '/';
        return;
    }
    
    // Render thông tin sản phẩm
    renderProductDetail(product);
    
    // Render sản phẩm liên quan
    renderRelatedProducts(product);
    
    // Ẩn loading
    hideLoading();
    
    // Setup event listeners
    setupQuantityButtons();
    setupAddToCartButton(product);
    setupBuyNowButton(product);
});

function renderProductDetail(product) {
    document.title = `${product.name} - CreativeTeam`;
    
    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = formatPrice(product.price);
    document.getElementById('productDescription').textContent = product.description;
}

function renderRelatedProducts(product) {
    const relatedProducts = getRelatedProducts(product);
    const container = document.getElementById('relatedProducts');
    
    container.innerHTML = relatedProducts
        .map(product => createProductCard(product))
        .join('');
}

function setupQuantityButtons() {
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });
    
    quantityInput.addEventListener('change', () => {
        if (quantityInput.value < 1) {
            quantityInput.value = 1;
        }
    });
}

function setupAddToCartButton(product) {
    const addToCartBtn = document.getElementById('addToCartBtn');
    
    addToCartBtn.addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        for (let i = 0; i < quantity; i++) {
            addToCart(product.id);
        }
    });
}

function setupBuyNowButton(product) {
    const buyNowBtn = document.getElementById('buyNowBtn');
    
    buyNowBtn.addEventListener('click', () => {
        const quantity = parseInt(document.getElementById('quantity').value);
        for (let i = 0; i < quantity; i++) {
            addToCart(product.id);
        }
        window.location.href = '/cart.html';
    });
} 