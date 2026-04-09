// Product Database
const products = [
    { id: 1, name: "Premium Kibble Bag", price: 15, category: "food", description: "Complete nutrition for adult dogs", donationMessage: "Provides 1 meal for a stray dog", image: "Product_Images/Premium_Kibble_Bag.png" },
    { id: 2, name: "Dog Blanket", price: 8, category: "accessories", description: "Warm and cozy blanket for cold nights", donationMessage: "Provides 1 warm blanket", image: "Product_Images/Dog_Blanket.png" },
    { id: 3, name: "Cozy Pet Bed", price: 25, category: "accessories", description: "Soft orthopedic bed", donationMessage: "Provides 2 warm blankets", image: "Product_Images/Cozy_Pet_Bed.png" },
    { id: 4, name: "Cat Kibble", price: 12, category: "cat-food", description: "Premium dry food for cats", donationMessage: "Provides 2 meals for stray cats", image: "Product_Images/Cat_Kibble.png" },
    { id: 5, name: "Dental Chews", price: 10, category: "food", description: "Clean teeth and fresh breath", donationMessage: "Provides 1 meal", image: "Product_Images/Dental_Chews.png" },
    { id: 6, name: "Cat Scratching Post", price: 22, category: "accessories", description: "Save your furniture!", donationMessage: "Provides 1 blanket", image: "Product_Images/Cat_Scratching_Post.png" },
    { id: 7, name: "First Aid Kit", price: 18, category: "medical", description: "Essential supplies for injuries", donationMessage: "Helps treat 1 injured animal", image: "Product_Images/First_Aid_Kit.png" },
    { id: 8, name: "Wet Cat Food (12-pack)", price: 24, category: "cat-food", description: "Grain-free wet food", donationMessage: "Provides 6 meals for cats", image: "Product_Images/Wet_Cat_Food.png" },
    { id: 9, name: "Stuffed Toy", price: 7, category: "accessories", description: "Durable chew toy", donationMessage: "Provides playtime joy", image: "Product_Images/Stuffed_Toy.png" },
    { id: 10, name: "Flea Treatment", price: 28, category: "medical", description: "Monthly flea prevention", donationMessage: "Protects 1 animal from fleas", image: "Product_Images/Flea_Treatment.png" },
    { id: 11, name: "Donation: $5", price: 5, category: "donation", description: "Direct donation to help strays", donationMessage: "Provides medical care", image: "Product_Images/Donation.png" },
    { id: 12, name: "Donation: $20", price: 20, category: "donation", description: "Larger donation for more impact", donationMessage: "Provides 5 meals + blanket", image: "Product_Images/Donation.png" }
];

// Shopping cart data
let cart = [];

// State
let currentCategory = "all";
let currentSort = "default";
let currentSearch = "";

// DOM elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const messageArea = document.getElementById("messageArea");

// Cart DOM elements
const cartIcon = document.getElementById("cartIcon");
const cartSidebar = document.getElementById("cartSidebar");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotalAmountSpan = document.getElementById("cartTotalAmount");
const cartItemCountSpan = document.getElementById("cartItemCount");
const checkoutBtn = document.getElementById("checkoutBtn");

// Modal elements
const modal = document.getElementById("filterModal");
const filterModalBtn = document.getElementById("filterModalBtn");
const closeBtn = document.querySelector(".close-btn");
const modalClearBtn = document.getElementById("modalClearBtn");

// Open modal
filterModalBtn.onclick = function() {
    modal.style.display = "flex";
};

// Close modal
closeBtn.onclick = function() {
    modal.style.display = "none";
};

// Close modal when clicking outside content
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

function showMessage(text, type = "info") {
    messageArea.textContent = text;
    messageArea.className = `message-area show ${type}`;
    setTimeout(() => {
        messageArea.classList.remove("show");
    }, 3000);
}

function hideMessage() {
    messageArea.classList.remove("show");
}

function getFilteredProducts() {
    let filtered = [...products];
    if (currentCategory !== "all") {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    if (currentSearch.trim() !== "") {
        const keyword = currentSearch.trim().toLowerCase();
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(keyword) || 
            p.description.toLowerCase().includes(keyword)
        );
    }
    return filtered;
}

function sortProducts(productsToSort) {
    const sorted = [...productsToSort];
    if (currentSort === "price-asc") {
        sorted.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-desc") {
        sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
}

function checkEmptyState(filteredProducts) {
    if (filteredProducts.length === 0) {
        if (currentSearch.trim() !== "") {
            showMessage("No products found. Please try another keyword", "error");
        } else if (currentCategory !== "all") {
            showMessage("No products in this category yet. Check back soon!", "info");
        }
        productGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--text-color);">No products available. Please try a different filter.</div>`;
        return true;
    }
    hideMessage();
    return false;
}

function renderProducts() {
    const filtered = getFilteredProducts();
    const sorted = sortProducts(filtered);
    if (checkEmptyState(sorted)) return;

    productGrid.innerHTML = sorted.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">CA$${product.price}</div>
                <div class="product-description">${product.description}</div>
                <div class="donation-message">${product.donationMessage}</div>
                <button class="add-to-cart-btn" 
                    data-id="${product.id}" 
                    data-name="${product.name}" 
                    data-price="${product.price}" 
                    data-image="${product.image}" 
                    data-message="${product.donationMessage}">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join("");

    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", handleAddToCart);
    });
}

function handleAddToCart(e) {
    const btn = e.currentTarget;
    const productId = parseInt(btn.getAttribute("data-id"));
    const productName = btn.getAttribute("data-name");
    const productPrice = parseInt(btn.getAttribute("data-price"));
    const productImage = btn.getAttribute("data-image");
    const donationMessage = btn.getAttribute("data-message");

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    updateButtonQuantity(productId);
    
    updateCartUI();
    
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = `✓ Added: ${productName} - $${productPrice}. ${donationMessage}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

function updateShop() {
    renderProducts();
    // Update active state in modal buttons
    document.querySelectorAll(".modal-filter-group .filter-btn").forEach(btn => {
        if (btn.getAttribute("data-category") === currentCategory) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

function resetAllFilters() {
    currentCategory = "all";
    currentSearch = "";
    currentSort = "default";
    searchInput.value = "";
    sortSelect.value = "default";
    updateShop();
    showMessage("All filters cleared. Showing all products.", "info");
    modal.style.display = "none";
}

function bindEvents() {
    // Bind filter buttons inside modal
    document.querySelectorAll(".modal-filter-group .filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const category = btn.getAttribute("data-category");
            currentCategory = category;
            updateShop();
            modal.style.display = "none";
            showMessage(`Filtered by: ${btn.textContent}`, "info");
        });
    });

    // Search with debounce
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearch = e.target.value;
            if (currentSearch.length > 50) {
                currentSearch = currentSearch.substring(0, 50);
                searchInput.value = currentSearch;
                showMessage("Search trimmed to 50 characters", "info");
            }
            updateShop();
        }, 300);
    });

    // Sort
    sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        updateShop();
    });

    // Clear button in modal
    modalClearBtn.addEventListener("click", resetAllFilters);

    // Cart icon click - open sidebar
    cartIcon.addEventListener("click", () => {
        cartSidebar.classList.add("open");
    });

    // Close sidebar
    closeCartBtn.addEventListener("click", () => {
        cartSidebar.classList.remove("open");
    });

    // Click outside to close (optional)
    window.addEventListener("click", (e) => {
        if (e.target === cartSidebar) {
            cartSidebar.classList.remove("open");
        }
    });

    // Checkout button
    checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) {
            showMessage("Your cart is empty. Add some items first!", "error");
        } else {
            showMessage(`Thank you for your purchase! Total: $${cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}`, "success");
            cart = [];
            updateCartUI();
            document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
                btn.innerHTML = "Add to Cart";
            });
            cartSidebar.classList.remove("open");
        }
    });
}

function init() {
    bindEvents();
    renderProducts();
    updateCartUI();
}

init();

function updateButtonQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    const quantity = cartItem ? cartItem.quantity : 0;
    
    const btn = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
    if (btn) {
        if (quantity > 0) {
            btn.innerHTML = `${quantity}`;
        } else {
            btn.innerHTML = `Add to Cart`;
        }
    }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCountSpan.textContent = totalItems;
    
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalAmountSpan.textContent = totalAmount;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        return;
    }
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/60x60/f0eeea/999?text=No+Img'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="cart-qty-decr" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="cart-qty-incr" data-id="${item.id}">+</button>
                </div>
                <span class="cart-item-remove" data-id="${item.id}">Remove</span>
            </div>
        </div>
    `).join("");
    
    document.querySelectorAll(".cart-qty-incr").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            const item = cart.find(i => i.id === id);
            if (item) {
                item.quantity++;
                updateButtonQuantity(id);
                updateCartUI();
            }
        });
    });
    
    document.querySelectorAll(".cart-qty-decr").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            const item = cart.find(i => i.id === id);
            if (item && item.quantity > 1) {
                item.quantity--;
                updateButtonQuantity(id);
                updateCartUI();
            } else if (item && item.quantity === 1) {
                cart = cart.filter(i => i.id !== id);
                updateButtonQuantity(id);
                updateCartUI();
            }
        });
    });
    
    document.querySelectorAll(".cart-item-remove").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = parseInt(btn.getAttribute("data-id"));
            cart = cart.filter(i => i.id !== id);
            updateButtonQuantity(id);
            updateCartUI();
        });
    });
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}
