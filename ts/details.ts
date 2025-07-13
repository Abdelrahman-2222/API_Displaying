interface ProductDetail extends Product {}

interface DummyJsonProductDetail {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    thumbnail: string;
    rating: number;
    brand?: string;
    stock?: number;
    discountPercentage?: number;
}

interface UserDetail {
    id?: number;
    name: string;
    email: string;
    password: string;
}

// DOM Elements for details page
const detailsLoadingSpinner = document.getElementById('loadingSpinner') as HTMLElement;
const productDetailsContainer = document.getElementById('productDetailsContainer') as HTMLElement;
const errorContainer = document.getElementById('errorContainer') as HTMLElement;
const detailsUserWelcome = document.getElementById('userWelcome') as HTMLElement;

// Product detail elements
const productImage = document.getElementById('productImage') as HTMLImageElement;
const productTitle = document.getElementById('productTitle') as HTMLElement;
const productPrice = document.getElementById('productPrice') as HTMLElement;
const productDescription = document.getElementById('productDescription') as HTMLElement;
const productCategory = document.getElementById('productCategory') as HTMLElement;
const productBrand = document.getElementById('productBrand') as HTMLElement;
const productSource = document.getElementById('productSource') as HTMLElement;
const ratingValue = document.getElementById('ratingValue') as HTMLElement;
const ratingCount = document.getElementById('ratingCount') as HTMLElement;

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    checkDetailsUserAuthentication();
    await loadProductDetails();
});

function checkDetailsUserAuthentication(): void {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    const userData: UserDetail = JSON.parse(user);
    detailsUserWelcome.innerHTML = `<i class="fas fa-user-circle me-1"></i>Welcome, ${userData.name}!`;
}

async function loadProductDetails(): Promise<void> {
    try {
        showDetailsLoading(true);
        
        const productId = localStorage.getItem('selectedProductId');
        const productSource = localStorage.getItem('selectedProductSource');
        
        if (!productId || !productSource) {
            showDetailsError();
            return;
        }
        
        let product: ProductDetail | DummyJsonProductDetail | null = null;
        
        if (productSource === 'fakeapi') {
            product = await fetchFakeApiProduct(parseInt(productId));
        } else if (productSource === 'dummyjson') {
            product = await fetchDummyJsonProduct(parseInt(productId));
        } else {
            showDetailsError();
            return;
        }
        
        if (product) {
            displayProductDetails(product, productSource);
            showDetailsLoading(false);
        } else {
            showDetailsError();
        }
        
    } catch (error) {
        console.error('Error loading product details:', error);
        showDetailsError();
    }
}

async function fetchFakeApiProduct(id: number): Promise<ProductDetail | null> {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
            throw new Error('Product not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching FakeAPI product:', error);
        return null;
    }
}

async function fetchDummyJsonProduct(id: number): Promise<DummyJsonProductDetail | null> {
    try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
            throw new Error('Product not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching DummyJSON product:', error);
        return null;
    }
}

function displayProductDetails(product: ProductDetail | DummyJsonProductDetail, source: string): void {
    // Set source badge
    productSource.textContent = source === 'fakeapi' ? 'FakeAPI Products' : 'DummyJSON Products';
    productSource.className = `badge fs-6 mb-2 source-${source}`;
    
    // Basic product info
    productTitle.textContent = product.title;
    productPrice.textContent = `$${product.price}`;
    productDescription.textContent = product.description;
    productCategory.textContent = product.category;
    
    // Handle different image properties
    if ('image' in product) {
        // FakeAPI product
        productImage.src = product.image;
        productImage.alt = product.title;
        ratingValue.textContent = product.rating.rate.toString();
        ratingCount.textContent = `(${product.rating.count} reviews)`;
        productBrand.classList.add('d-none');
    } else {
        // DummyJSON product
        productImage.src = product.thumbnail;
        productImage.alt = product.title;
        ratingValue.textContent = product.rating.toString();
        ratingCount.textContent = product.stock ? `(${product.stock} in stock)` : '';
        
        if (product.brand) {
            productBrand.textContent = product.brand;
            productBrand.classList.remove('d-none');
        } else {
            productBrand.classList.add('d-none');
        }
    }
    
    // Add fade-in animation
    productDetailsContainer.classList.add('fade-in');
}

function showDetailsLoading(show: boolean): void {
    if (show) {
        detailsLoadingSpinner.classList.remove('d-none');
        productDetailsContainer.classList.add('d-none');
        errorContainer.classList.add('d-none');
    } else {
        detailsLoadingSpinner.classList.add('d-none');
        productDetailsContainer.classList.remove('d-none');
    }
}

function showDetailsError(): void {
    detailsLoadingSpinner.classList.add('d-none');
    productDetailsContainer.classList.add('d-none');
    errorContainer.classList.remove('d-none');
}

function goBack(): void {
    window.location.href = 'home.html';
}

// Make the function available globally
(window as any).goBack = goBack;