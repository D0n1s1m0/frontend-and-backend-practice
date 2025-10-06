// Данные товаров
const products = [
    {
        id: 1,
        name: "Смартфон Samsung Galaxy",
        price: 29990,
        oldPrice: 34990,
        category: "electronics",
        image: "../images/phone.jpg",
        discount: true
    },
    {
        id: 2,
        name: "Ноутбук ASUS VivoBook",
        price: 54990,
        oldPrice: 64990,
        category: "electronics",
        image: "../images/laptop.jpg",
        discount: true
    },
    {
        id: 3,
        name: "Научная фантастика 'Дюна'",
        price: 890,
        category: "books",
        image: "../images/book.jpg"
    },
    {
        id: 4,
        name: "Футболка хлопковая",
        price: 1290,
        category: "clothing",
        image: "../images/tshirt.jpg"
    },
    {
        id: 5,
        name: "Беспроводные наушники",
        price: 7990,
        category: "electronics",
        image: "../images/headphones.jpg"
    },
    {
        id: 6,
        name: "Джинсы классические",
        price: 3590,
        category: "clothing",
        image: "../images/jeans.jpg"
    }
];

// Корзина
let cart = [];
let total = 0;

// DOM элементы
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const orderModal = document.getElementById('orderModal');
const modalClose = document.getElementById('modalClose');
const orderForm = document.getElementById('orderForm');

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
    updateCart();
    
    // Обработчики событий
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    checkoutBtn.addEventListener('click', openOrderModal);
    modalClose.addEventListener('click', closeOrderModal);
    orderForm.addEventListener('submit', submitOrder);
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            closeOrderModal();
        }
    });
});

// Рендер товаров
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        if (product.discount) {
            productCard.classList.add('product-card--discount');
        }
        
        const isInCart = cart.some(item => item.id === product.id);
        if (isInCart) {
            productCard.classList.add('product-card--selected');
        }
        
        productCard.innerHTML = `
            ${product.discount ? '<div class="product-card__badge">-15%</div>' : ''}
            <img src="${product.image}" alt="${product.name}" class="product-card__image">
            <div class="product-card__info">
                <h4 class="product-card__name">${product.name}</h4>
                <div class="product-card__price">
                    ${product.oldPrice ? `
                        <span class="product-card__price-old">${product.oldPrice} руб</span>
                        <span class="product-card__price-new">${product.price} руб</span>
                    ` : `${product.price} руб`}
                </div>
                <button class="product-card__button" onclick="addToCart(${product.id})">
                    ${isInCart ? 'В корзине' : 'В корзину'}
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Фильтрация товаров
function filterProducts() {
    const category = categoryFilter.value;
    const priceRange = priceFilter.value;
    
    let filteredProducts = products;
    
    // Фильтр по категории
    if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    // Фильтр по цене
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (priceRange.endsWith('+')) {
            filteredProducts = filteredProducts.filter(product => product.price >= min);
        } else {
            filteredProducts = filteredProducts.filter(product => product.price >= min && product.price <= max);
        }
    }
    
    renderProducts(filteredProducts);
}

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (!existingItem) {
        cart.push({...product, quantity: 1});
        updateCart();
        renderProducts(products); // Перерисовываем товары для обновления состояния кнопок
    }
}

// Удаление из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    renderProducts(products); // Перерисовываем товары для обновления состояния кнопок
}

// Обновление корзины
function updateCart() {
    cartItems.innerHTML = '';
    total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart__empty">Корзина пуста</div>';
        checkoutBtn.disabled = true;
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item__info">
                    <div class="cart-item__name">${item.name}</div>
                    <div class="cart-item__price">${item.price} руб × ${item.quantity}</div>
                </div>
                <button class="cart-item__remove" onclick="removeFromCart(${item.id})">✕</button>
            `;
            cartItems.appendChild(cartItem);
        });
        
        checkoutBtn.disabled = false;
    }
    
    cartTotal.textContent = `Итого: ${total} руб`;
}

// Открытие модального окна заказа
function openOrderModal() {
    if (cart.length > 0) {
        orderModal.style.display = 'block';
    }
}

// Закрытие модального окна
function closeOrderModal() {
    orderModal.style.display = 'none';
    orderForm.reset();
}

// Оформление заказа
function submitOrder(event) {
    event.preventDefault();
    
    const formData = new FormData(orderForm);
    const order = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        items: cart,
        total: total,
        date: new Date().toISOString()
    };
    
    // В реальном приложении здесь был бы AJAX запрос к серверу
    console.log('Заказ оформлен:', order);
    
    alert(`Заказ успешно оформлен! Номер заказа: #${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    
    // Очистка корзины
    cart = [];
    updateCart();
    renderProducts(products);
    closeOrderModal();
}
