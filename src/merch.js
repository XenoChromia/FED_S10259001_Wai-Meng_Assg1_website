// Load and display merch items
async function loadMerchItems() {
    try {
        const response = await fetch('../public/data.json');
        const data = await response.json();
        displayMerchItems(data.products);
    } catch (error) {
        console.error('Error loading merch items:', error);
        showErrorMessage();
    }
}

function displayMerchItems(products) {
    const merchGrid = document.getElementById('merch-grid');
    
    merchGrid.innerHTML = products.map(product => `
        <a href="product.html?id=${product.id}" class="merch-item">
            <img src="${product.image}" alt="${product.name} style="width: 100%;"">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <span class="price">$${product.price.toFixed(2)}</span>
            <button class="view-details">View Details</button>
        </a>
    `).join('');
}

function showErrorMessage() {
    const merchGrid = document.getElementById('merch-grid');
    merchGrid.innerHTML = `
        <div class="error-message">
            <h2>Oops! Something went wrong</h2>
            <p>We're having trouble loading the merchandise. Please try again later.</p>
        </div>
    `;
}

// Load merch items when the page loads
document.addEventListener('DOMContentLoaded', loadMerchItems);