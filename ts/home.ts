interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
}

interface DummyJsonProduct {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    thumbnail: string;
    rating: number;
    brand?: string;
}

interface CartProduct {
    productId: number;
    quantity: number;
}

interface Cart {
    id: number;
    userId: number;
    date: string;
    products: CartProduct[];
}

interface User {
    id?: number;
    name: string;
    email: string;
    password: string;
}

let products: Product[] = [];
let dogs: DummyJsonProduct[] = [];

// DOM Elements
const loadingSpinner = document.getElementById('loadingSpinner') as HTMLElement;
const userWelcome = document.getElementById('userWelcome') as HTMLElement;
const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;

// Container elements
const allProductsContainer = document.getElementById('allProductsContainer') as HTMLElement;
const allDogsContainer = document.getElementById('allDogsContainer') as HTMLElement;
const productsContainer = document.getElementById('productsContainer') as HTMLElement;
const dogsContainer = document.getElementById('dogsContainer') as HTMLElement;

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    checkUserAuthentication();
    await loadData();
    setupEventListeners();
});

function checkUserAuthentication(): void {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    const userData: User = JSON.parse(user);
    userWelcome.innerHTML = `<i class="fas fa-user-circle me-1"></i>Welcome, ${userData.name}!`;
}

function setupEventListeners(): void {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}

async function loadData(): Promise<void> {
    try {
        showLoading(true);
        
        // Load products and dogs in parallel
        const [productsResponse, cartsResponse] = await Promise.all([
            fetch('https://fakestoreapi.com/products'),
            fetch('https://dummyjson.com/products')
        ]);

        if (!productsResponse.ok || !cartsResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        products = await productsResponse.json();
        const dogsResponse = await cartsResponse.json();
        dogs = dogsResponse.products || dogsResponse; // Handle different response structures

        renderAllContent();
        renderProducts();
        renderDogs();
        
        showLoading(false);
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data. Please try again.');
        showLoading(false);
    }
}

function showLoading(show: boolean): void {
    if (loadingSpinner) {
        loadingSpinner.style.display = show ? 'block' : 'none';
    }
    document.body.classList.toggle('content-loaded', !show);
}

function showError(message: string): void {
    const errorHtml = `
        <div class="empty-state">
            <i class="fas fa-exclamation-triangle text-warning"></i>
            <h5>Error</h5>
            <p>${message}</p>
        </div>
    `;
    
    [allProductsContainer, allDogsContainer, productsContainer, dogsContainer].forEach(container => {
        if (container) container.innerHTML = errorHtml;
    });
}

function renderAllContent(): void {
    if (allProductsContainer && allDogsContainer) {
        allProductsContainer.innerHTML = renderProductsGrid(products.slice(0, 6));
        allDogsContainer.innerHTML = renderDogsGrid(dogs.slice(0, 6));
    }
}

function renderProducts(): void {
    if (productsContainer) {
        productsContainer.innerHTML = renderProductsGrid(products);
    }
}

function renderDogs(): void {
    if (dogsContainer) {
        dogsContainer.innerHTML = renderDogsGrid(dogs);
    }
}

function renderProductsGrid(productList: Product[]): string {
    if (productList.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h5>No Products Found</h5>
                <p>No products available at the moment.</p>
            </div>
        `;
    }

    return productList.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy">
            <div class="card-body p-3">
                <div class="mb-2">
                    <span class="product-category">${product.category}</span>
                </div>
                <h6 class="product-title mb-2">${truncateText(product.title, 50)}</h6>
                <p class="text-muted small mb-2">${truncateText(product.description, 80)}</p>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="product-price">$${product.price}</span>
                    <div class="text-warning small">
                        <i class="fas fa-star"></i>
                        ${product.rating.rate} (${product.rating.count})
                    </div>
                </div>
                <button class="btn btn-primary btn-sm w-100" onclick="viewProductDetails(${product.id}, 'fakeapi')">
                    <i class="fas fa-eye me-1"></i>View Details
                </button>
            </div>
        </div>
    `).join('');
}

function renderCartsGrid(cartList: Cart[]): string {
    if (cartList.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h5>No Carts Found</h5>
                <p>No shopping carts available.</p>
            </div>
        `;
    }

    return cartList.map(cart => `
        <div class="cart-card">
            <div class="card-body p-3">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <span class="cart-id">Cart #${cart.id}</span>
                    <small class="cart-date">${formatDate(cart.date)}</small>
                </div>
                <div class="mb-2">
                    <span class="text-muted small">User ID: </span>
                    <span class="fw-semibold">${cart.userId}</span>
                </div>
                <div class="mb-2">
                    <span class="text-muted small">Products: </span>
                    <span class="cart-products-count">${cart.products.length} items</span>
                </div>
                <div class="mt-3">
                    <small class="text-muted">Product IDs: </small>
                    <div class="mt-1">
                        ${cart.products.map(p => `
                            <span class="badge bg-light text-dark me-1">${p.productId} (×${p.quantity})</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderDogsGrid(dogList: DummyJsonProduct[]): string {
    if (dogList.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-dog"></i>
                <h5>No Dogs Found</h5>
                <p>No dogs available at the moment.</p>
            </div>
        `;
    }

    return dogList.map(dog => `
        <div class="product-card">
            <img src="${dog.thumbnail}" alt="${dog.title}" class="product-image" loading="lazy">
            <div class="card-body p-3">
                <div class="mb-2">
                    <span class="product-category">${dog.category}</span>
                    ${dog.brand ? `<span class="badge bg-secondary ms-1">${dog.brand}</span>` : ''}
                </div>
                <h6 class="product-title mb-2">${truncateText(dog.title, 50)}</h6>
                <p class="text-muted small mb-2">${truncateText(dog.description, 80)}</p>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="product-price">$${dog.price}</span>
                    <div class="text-warning small">
                        <i class="fas fa-star"></i>
                        ${dog.rating}
                    </div>
                </div>
                <button class="btn btn-info btn-sm w-100" onclick="viewProductDetails(${dog.id}, 'dummyjson')">
                    <i class="fas fa-eye me-1"></i>View Details
                </button>
            </div>
        </div>
    `).join('');
}

function truncateText(text: string, maxLength: number): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Global function for viewing product details
function viewProductDetails(id: number, source: string): void {
    // Store the product details in localStorage for the details page
    localStorage.setItem('selectedProductId', id.toString());
    localStorage.setItem('selectedProductSource', source);
    
    // Navigate to details page
    window.location.href = 'details.html';
}

// Make the function available globally
(window as any).viewProductDetails = viewProductDetails;