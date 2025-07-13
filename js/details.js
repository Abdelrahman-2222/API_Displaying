"use strict";
// DOM Elements for details page
const detailsLoadingSpinner = document.getElementById('loadingSpinner');
const productDetailsContainer = document.getElementById('productDetailsContainer');
const errorContainer = document.getElementById('errorContainer');
const detailsUserWelcome = document.getElementById('userWelcome');
// Product detail elements
const productImage = document.getElementById('productImage');
const productTitle = document.getElementById('productTitle');
const productPrice = document.getElementById('productPrice');
const productDescription = document.getElementById('productDescription');
const productCategory = document.getElementById('productCategory');
const productBrand = document.getElementById('productBrand');
const productSource = document.getElementById('productSource');
const ratingValue = document.getElementById('ratingValue');
const ratingCount = document.getElementById('ratingCount');
// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    checkDetailsUserAuthentication();
    await loadProductDetails();
});
function checkDetailsUserAuthentication() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    const userData = JSON.parse(user);
    detailsUserWelcome.innerHTML = `<i class="fas fa-user-circle me-1"></i>Welcome, ${userData.name}!`;
}
async function loadProductDetails() {
    try {
        showDetailsLoading(true);
        const productId = localStorage.getItem('selectedProductId');
        const productSource = localStorage.getItem('selectedProductSource');
        if (!productId || !productSource) {
            showDetailsError();
            return;
        }
        let product = null;
        if (productSource === 'fakeapi') {
            product = await fetchFakeApiProduct(parseInt(productId));
        }
        else if (productSource === 'dummyjson') {
            product = await fetchDummyJsonProduct(parseInt(productId));
        }
        else {
            showDetailsError();
            return;
        }
        if (product) {
            displayProductDetails(product, productSource);
            showDetailsLoading(false);
        }
        else {
            showDetailsError();
        }
    }
    catch (error) {
        console.error('Error loading product details:', error);
        showDetailsError();
    }
}
async function fetchFakeApiProduct(id) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
            throw new Error('Product not found');
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error fetching FakeAPI product:', error);
        return null;
    }
}
async function fetchDummyJsonProduct(id) {
    try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
            throw new Error('Product not found');
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error fetching DummyJSON product:', error);
        return null;
    }
}
function displayProductDetails(product, source) {
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
    }
    else {
        // DummyJSON product
        productImage.src = product.thumbnail;
        productImage.alt = product.title;
        ratingValue.textContent = product.rating.toString();
        ratingCount.textContent = product.stock ? `(${product.stock} in stock)` : '';
        if (product.brand) {
            productBrand.textContent = product.brand;
            productBrand.classList.remove('d-none');
        }
        else {
            productBrand.classList.add('d-none');
        }
    }
    // Add fade-in animation
    productDetailsContainer.classList.add('fade-in');
}
function showDetailsLoading(show) {
    if (show) {
        detailsLoadingSpinner.classList.remove('d-none');
        productDetailsContainer.classList.add('d-none');
        errorContainer.classList.add('d-none');
    }
    else {
        detailsLoadingSpinner.classList.add('d-none');
        productDetailsContainer.classList.remove('d-none');
    }
}
function showDetailsError() {
    detailsLoadingSpinner.classList.add('d-none');
    productDetailsContainer.classList.add('d-none');
    errorContainer.classList.remove('d-none');
}
function goBack() {
    window.location.href = 'home.html';
}
// Make the function available globally
window.goBack = goBack;
