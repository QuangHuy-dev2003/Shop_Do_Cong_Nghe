document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    
    if (!productId) {
        window.location.href = "/";
        return;
    }

    // Lấy thông tin sản phẩm từ products.js
    const product = getFeaturedProducts().find(p => p.id === productId);
    if (!product) {
        window.location.href = "/";
        return;
    }

    // Hiển thị thông tin sản phẩm
    renderProductDetail(product);
});

function renderProductDetail(product) {
    document.title = `${product.name} - CreativeTeam`;
    
    document.getElementById('productImage').src = product.image;
    document.getElementById('productImage').alt = product.name;
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = formatPrice(product.price);
    document.getElementById('productDescription').textContent = product.description;

    // Render thông số kỹ thuật
    const specsTable = document.getElementById('productSpecs');
    const specs = getProductSpecs(product);
    specsTable.innerHTML = specs.map(spec => `
        <div class="spec-label">${spec.label}:</div>
        <div class="spec-value">${spec.value}</div>
    `).join('');

    // Setup các button
    setupQuantityButtons();
    setupAddToCartButton(product);
    setupBuyNowButton(product);

    // Render sản phẩm liên quan
    renderRelatedProducts(product);
}

function getProductSpecs(product) {
    // Tùy theo loại sản phẩm mà trả về thông số khác nhau
    switch(product.category) {
        case 'laptop':
            return [
                { label: 'Thương hiệu', value: product.brand },
                { label: 'Màn hình', value: product.description.split(',')[3] },
                { label: 'CPU', value: product.description.split(',')[0] },
                { label: 'RAM', value: product.description.split(',')[1] },
                { label: 'Ổ cứng', value: product.description.split(',')[2] }
            ];
        case 'smartwatch':
            return [
                { label: 'Thương hiệu', value: product.brand },
                { label: 'Kích thước', value: product.description.split(',')[0] },
                { label: 'Chất liệu', value: product.description.split(',')[1] },
                { label: 'Dây đeo', value: product.description.split(',')[2] }
            ];
        // Thêm case cho các loại sản phẩm khác
        default:
            return [];
    }
}

function renderRelatedProducts(product) {
    const relatedContainer = document.getElementById('relatedProducts');
    if (!relatedContainer) return;

    showLoading();

    // Lấy tất cả sản phẩm
    const allProducts = getAllProducts();
    
    // Lấy 4 sản phẩm ngẫu nhiên từ mỗi danh mục
    const categories = ['laptops', 'smartwatches', 'headphones'];
    let randomProducts = [];
    
    categories.forEach(category => {
        const categoryProducts = allProducts
            .filter(p => p.category === category && p.id !== product.id);
        if (categoryProducts.length > 0) {
            const randomProduct = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];
            randomProducts.push(randomProduct);
        }
    });

    // Thêm 1 sản phẩm từ cùng danh mục với sản phẩm hiện tại
    const sameCategory = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
    
    if (sameCategory.length > 0) {
        randomProducts.unshift(sameCategory[0]);
    }

    setTimeout(() => {
        relatedContainer.innerHTML = randomProducts.map(product => `
            <div class="product-card">
                <div class="product-card__image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-card__content">
                    <h3 class="product-card__title">${product.name}</h3>
                    <div class="product-card__price">${formatPrice(product.price)}</div>
                    <button class="btn btn--primary" onclick="addToCart('${product.id}')">
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        `).join('');
        
        hideLoading();
    }, 500);
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