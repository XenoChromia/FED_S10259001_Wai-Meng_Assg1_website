async function loadProducts() {
    try {
        const response = await fetch('../public/data.json');
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

async function getProduct(id) {
    const products = await loadProducts();
    return products.find(p => p.id === parseInt(id));
}


let currentProduct = null;

async function loadProductDetails() {
    const productId = getProductIdFromUrl();
    currentProduct = await getProduct(productId);

    if (!currentProduct) {
        window.location.href = 'merch.html';
        return;
    }

    updateProductUI();
}

function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

function updateProductUI() {
    document.title = `Ado Shop - ${currentProduct.name}`;
    document.getElementById('product-description').textContent = currentProduct.description;
    document.getElementById('product-name').textContent = currentProduct.name;
    document.getElementById('product-price').textContent = currentProduct.price.toFixed(2);
    document.getElementById('product-img').src = currentProduct.image;
    document.getElementById('product-img').alt = currentProduct.name;
    document.getElementById('modal-img').src = currentProduct.image;
    document.getElementById('modal-img').alt = currentProduct.name;
    
    // Add specific product details
    const detailsContainer = document.getElementById('product-details');
    if (currentProduct.details) {
        detailsContainer.innerHTML = `
            <h3>${currentProduct.details.format || currentProduct.details.material}</h3>
            <ul>
                ${currentProduct.details.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        `;
    }
}

function incrementQuantity() {
    const qtyElement = document.getElementById('qty-display');
    let qty = parseInt(qtyElement.textContent);
    qtyElement.textContent = qty + 1;
}

function decrementQuantity() {
    const qtyElement = document.getElementById('qty-display');
    let qty = parseInt(qtyElement.textContent);
    if (qty > 1) {
        qtyElement.textContent = qty - 1;
    }
}

function addToCartWithQuantity() {
    if (!currentProduct) return;
    
    const qty = parseInt(document.getElementById('qty-display').textContent);
    for (let i = 0; i < qty; i++) {
        cart.addItem(currentProduct);
    }
}

// Load product details when page loads
document.addEventListener('DOMContentLoaded', loadProductDetails);