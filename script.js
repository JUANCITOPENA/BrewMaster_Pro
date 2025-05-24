// script.js
document.addEventListener('DOMContentLoaded', () => {
    const splashScreen = document.getElementById('splash-screen');
    const appRoot = document.getElementById('app-root');

    // Simple Toast Notification System
    const toastContainer = document.getElementById('toast-container');
    function showToast(message, type = 'info', duration = 3500) {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.innerHTML = message; // Allows for icons like <i>
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('show');
        }, 10); // Delay to allow CSS transition
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode === toastContainer) {
                     toastContainer.removeChild(toast);
                }
            }, 500); // Wait for fade out transition
        }, duration);
    }
    window.showToast = showToast; // Make it globally available

    setTimeout(() => {
        splashScreen.classList.add('hidden');
        appRoot.style.display = 'flex'; 
        void appRoot.offsetWidth; 
        initializeApp();
    }, 2800);

    const coffeeProducts = [
        {
            id: 'mocha-basic', name: 'Cappuccino Mocha <i class="fas fa-mug-hot"></i>', subtitle: 'Delicioso y cremoso, el clásico que amas.', image: 'img/IMG1.png',
            prices: {'DOP': {small: 250.00, medium: 275.00, large: 300.00}, 'USD': {small: 4.99, medium: 5.49, large: 5.99}, 'EUR': {small: 4.59, medium: 5.09, large: 5.59}, 'MXN': {small: 89.00, medium: 99.00, large: 109.00}},
            defaultSize: 'medium', baseCurrency: 'DOP',
        },
        {
            id: 'mocha-premium', name: 'Mocha Premium <i class="fas fa-medal"></i>', subtitle: 'Espresso, chocolate rico y leche vaporizada.', image: 'img/IMG2.png',
            prices: {'DOP': {small: 270.00, medium: 300.00, large: 330.00}, 'USD': {small: 5.29, medium: 5.79, large: 6.29}, 'EUR': {small: 4.89, medium: 5.39, large: 5.89}, 'MXN': {small: 95.00, medium: 105.00, large: 115.00}},
            defaultSize: 'medium', baseCurrency: 'DOP', rating: { stars: 4.5, count: 324 },
            features: [{icon: 'fas fa-clock', text: 'Preparación: 3-5 min'}, {icon: 'fas fa-thermometer-half', text: 'Caliente (65-70°C)'}, {icon: 'fas fa-seedling', text: 'Ingredientes Naturales'}]
        },
        {
            id: 'mocha-deluxe', name: 'Mocha Deluxe <i class="fas fa-gem"></i>', subtitle: 'Personaliza tu experiencia con opciones selectas.', image: 'img/IMG3.png',
            prices: {'DOP': {small: 290.00, medium: 325.00, large: 360.00}, 'USD': {small: 5.49, medium: 5.99, large: 6.49}, 'EUR': {small: 5.09, medium: 5.59, large: 6.09}, 'MXN': {small: 99.00, medium: 109.00, large: 119.00}},
            defaultSize: 'medium', baseCurrency: 'DOP', availableSizes: ['small', 'medium', 'large'],
            ingredients: ['Espresso Forte', 'Chocolate Belga', 'Leche Cremada', 'Canela Ceylán'],
            paymentMethods: ['visa', 'paypal', 'mastercard', 'cash']
        },
        {
            id: 'mocha-supreme', name: 'Mocha Supreme <i class="fas fa-crown"></i>', subtitle: 'La indulgencia definitiva. Todo incluido.', image: 'img/IMG4.png',
            prices: {'DOP': {small: 350.00, medium: 390.00, large: 430.00}, 'USD': {small: 5.99, medium: 6.49, large: 6.99}, 'EUR': {small: 5.59, medium: 6.09, large: 6.59}, 'MXN': {small: 109.00, medium: 119.00, large: 129.00}},
            defaultSize: 'medium', baseCurrency: 'DOP', rating: { stars: 5, count: 1247 }, availableSizes: ['small', 'medium', 'large'],
            availableCurrencies: ['DOP', 'USD', 'EUR', 'MXN'],
            premiumIngredients: ['Doble Espresso Org.', 'Chocolate Suizo 70%', 'Leche Almendras Barista', 'Canela Suprema', 'Sirope Maple Puro', 'Crema Batida Artesanal'],
        }
    ];

    let currentProductIndex = 0;
    let favorites = loadFromLocalStorage('brewMasterFavorites_v5') || [];
    let cart = loadFromLocalStorage('brewMasterCart_v5') || [];
    
    let globalSelectedSize = coffeeProducts[0].defaultSize;
    let globalQuantity = 1;
    let globalCurrency = coffeeProducts[0].baseCurrency;

    const currencySymbols = { DOP: 'RD$', USD: '$', EUR: '€', MXN: '$' };
    const sizeNames = { small: 'Pequeño', medium: 'Mediano', large: 'Grande' };

    const carouselContainer = document.querySelector('.carousel-container');
    const progressDotsContainer = document.querySelector('.progress-indicator');
    const cartBadge = document.getElementById('cartBadge');
    const cartIconContainer = document.getElementById('cartIconContainer');
    const cartModalElement = new bootstrap.Modal(document.getElementById('cartModal'));
    const cartModalBody = document.getElementById('cartModalBody');
    const cartModalTotal = document.getElementById('cartModalTotal');
    const cartTotalContainer = document.getElementById('cartTotalContainer');
    const checkoutButton = document.getElementById('checkoutButton');

    const paymentGatewayModalElement = new bootstrap.Modal(document.getElementById('paymentGatewayModal'));
    const paymentItemList = document.getElementById('paymentItemList');
    const paymentTotalAmount = document.getElementById('paymentTotalAmount');
    const confirmPaymentButton = document.getElementById('confirmPaymentButton');
    const paymentForm = document.getElementById('paymentForm');

    const invoiceModalElement = new bootstrap.Modal(document.getElementById('invoiceModal'));
    const invoiceContentForPdf = document.getElementById('invoiceContentForPdf');
    const printInvoiceButton = document.getElementById('printInvoiceButton');
    const downloadPdfButton = document.getElementById('downloadPdfButton');

    function populateSlideContent(slideElement, product) {
        const displayCurrency = (product.availableCurrencies?.includes(globalCurrency)) ? globalCurrency : product.baseCurrency;
        let displaySize = product.defaultSize; 
        if(product.id === 'mocha-supreme' && product.availableSizes?.includes(globalSelectedSize)){
             displaySize = globalSelectedSize; 
        } else if (product.availableSizes?.includes(globalSelectedSize)) {
             displaySize = globalSelectedSize; 
        }

        const initialPrice = product.prices[displayCurrency]?.[displaySize] ?? product.prices[product.baseCurrency][product.defaultSize];

        slideElement.querySelector('.coffee-image').src = product.image;
        slideElement.querySelector('.coffee-image').alt = product.name.replace(/<[^>]*>?/gm, '');
        slideElement.querySelector('.coffee-title').innerHTML = product.name;
        const subtitleEl = slideElement.querySelector('.coffee-subtitle');
        if (subtitleEl) subtitleEl.textContent = product.subtitle || '';

        const priceTagEl = slideElement.querySelector('.price-tag:not(.product-total-price)');
        if (priceTagEl) {
            if (!product.availableSizes && !product.availableCurrencies) {
                priceTagEl.textContent = `${currencySymbols[product.baseCurrency]}${initialPrice.toFixed(2)}`;
                priceTagEl.style.display = 'inline-block';
            } else { priceTagEl.style.display = 'none'; }
        }
        
        updateFavoriteButtonsUI(product.id, slideElement);

        const ratingSection = slideElement.querySelector('.rating');
        if (product.rating && ratingSection) {
            ratingSection.style.display = 'block';
            ratingSection.querySelector('.stars').innerHTML = generateStars(product.rating.stars);
            ratingSection.querySelector('small').textContent = `${product.rating.stars.toFixed(1)}/5 (${product.rating.count} reseñas)`;
        } else if(ratingSection) { ratingSection.style.display = 'none'; }

        const accordionFeatures = slideElement.querySelector('.feature-list') ? slideElement.querySelector('.feature-list').closest('.accordion') : null;
        if (product.features && accordionFeatures) {
            accordionFeatures.style.display = 'block';
            accordionFeatures.querySelector('.feature-list').innerHTML = product.features.map(f => `<li><i class="${f.icon}"></i><span>${f.text}</span></li>`).join('');
        } else if(accordionFeatures) { accordionFeatures.style.display = 'none'; }
        
        const sizeSectionH6 = slideElement.querySelector('.size-options') ? slideElement.querySelector('.size-options').previousElementSibling : null;
        const sizeOptsCont = slideElement.querySelector('.size-options');
        if (product.availableSizes && sizeOptsCont) {
            if(sizeSectionH6) sizeSectionH6.style.display = 'block';
            sizeOptsCont.style.display = 'flex';
            sizeOptsCont.innerHTML = product.availableSizes.map(size => {
                const price = product.prices[displayCurrency]?.[size] ?? 0;
                const isActive = size === (product.id === 'mocha-supreme' ? globalSelectedSize : displaySize);
                return `<div class="size-option ${isActive ? 'active' : ''}" data-size="${size}"><div>${sizeNames[size]}</div><small>${currencySymbols[displayCurrency]}${price.toFixed(2)}</small></div>`}).join('');
        }  else { if(sizeOptsCont) sizeOptsCont.style.display = 'none'; if(sizeSectionH6) sizeSectionH6.style.display='none';}


        const qtySectionH6 = slideElement.querySelector('.quantity-selector') ? slideElement.querySelector('.quantity-selector').previousElementSibling : null;
        const qtySection = slideElement.querySelector('.quantity-selector');
        if (product.id === 'mocha-supreme' && qtySection) {
            if(qtySectionH6) qtySectionH6.style.display = 'block';
            qtySection.style.display = 'flex';
            const qtyDisp = qtySection.querySelector('#globalQuantityDisplay'); if(qtyDisp) qtyDisp.textContent = globalQuantity;
        } else { if(qtySection) qtySection.style.display = 'none'; if(qtySectionH6) qtySectionH6.style.display='none';}

        const currSectionH6 = slideElement.querySelector('.currency-selector') ? slideElement.querySelector('.currency-selector').previousElementSibling : null;
        const currSelCont = slideElement.querySelector('.currency-selector');
        if (product.availableCurrencies && currSelCont) {
            if(currSectionH6) currSectionH6.style.display = 'block';
            currSelCont.style.display = 'flex';
            currSelCont.innerHTML = product.availableCurrencies.map(curr => `<button class="currency-btn ${curr === globalCurrency ? 'active' : ''}" data-currency="${curr}">${getCurrencyEmoji(curr)} ${curr}</button>`).join('');
        } else {if(currSelCont) currSelCont.style.display = 'none'; if(currSectionH6) currSectionH6.style.display='none';}

        const dynamicPriceTag = slideElement.querySelector('.product-total-price');
        if (dynamicPriceTag) { (product.id === 'mocha-supreme' || product.id === 'mocha-deluxe') ? updateProductTotalPrice(product.id) : dynamicPriceTag.style.display = 'none'; }

        const ingredientsAccordionContainer = slideElement.querySelectorAll('.accordion')[product.features ? 1 : 0]; 
        if(product.ingredients && ingredientsAccordionContainer && ingredientsAccordionContainer.querySelector('.ingredients-grid')) {
            ingredientsAccordionContainer.style.display = 'block';
            ingredientsAccordionContainer.querySelector('.ingredients-grid').innerHTML = product.ingredients.map(ing => `<div class="ingredient-item">${ing}</div>`).join('');
        } else if(ingredientsAccordionContainer && ingredientsAccordionContainer.querySelector('.ingredients-grid')) {
            ingredientsAccordionContainer.style.display = 'none';
        }
        
        const premiumIngredientsAccordionContainer = slideElement.querySelectorAll('.accordion')[product.features ? (product.ingredients ? 2 : 1) : (product.ingredients ? 1 : 0)];
        if(product.premiumIngredients && premiumIngredientsAccordionContainer && premiumIngredientsAccordionContainer.querySelector('.ingredients-grid')) {
            premiumIngredientsAccordionContainer.style.display = 'block';
            premiumIngredientsAccordionContainer.querySelector('.ingredients-grid').innerHTML = product.premiumIngredients.map(ing => `<div class="ingredient-item">${ing}</div>`).join('');
        } else if (premiumIngredientsAccordionContainer && premiumIngredientsAccordionContainer.querySelector('.ingredients-grid')) {
            premiumIngredientsAccordionContainer.style.display = 'none';
        }

        const paymentSectionH6 = slideElement.querySelector('.payment-methods') ? slideElement.querySelector('.payment-methods').previousElementSibling : null;
        const payMethCont = slideElement.querySelector('.payment-methods');
        if (product.paymentMethods && payMethCont) {
            if(paymentSectionH6) paymentSectionH6.style.display = 'block';
            payMethCont.style.display = 'grid';
            payMethCont.innerHTML = product.paymentMethods.map(pm => `<div class="payment-method" data-method="${pm}"><i class="${getPaymentIconClass(pm)}"></i></div>`).join('');
            if(payMethCont.firstChild) payMethCont.firstChild.classList.add('active');
        } else {if(payMethCont) payMethCont.style.display = 'none'; if(paymentSectionH6) paymentSectionH6.style.display='none';}
    }

    function renderInitialSlidesAndDots() {
        const slideElements = document.querySelectorAll('.carousel-slide');
        coffeeProducts.forEach((product, index) => { if (slideElements[index]) populateSlideContent(slideElements[index], product); });
        progressDotsContainer.innerHTML = '';
        coffeeProducts.forEach((product, index) => { const dot = document.createElement('div'); dot.classList.add('progress-dot'); if (index === currentProductIndex) dot.classList.add('active'); dot.dataset.slideToIndex = index; dot.dataset.slideId = product.id; progressDotsContainer.appendChild(dot); });
        addEventListenersToDynamicContent(); updateAllProductTotalPrices(); updateActiveSlideAndDots();
    }
    
    function getPaymentIconClass(method) { const icons = { visa: 'fab fa-cc-visa', paypal: 'fab fa-paypal', mastercard: 'fab fa-cc-mastercard', cash: 'fas fa-money-bill-wave', mobile: 'fas fa-mobile-alt' }; return icons[method] || 'fas fa-credit-card'; }
    function getCurrencyEmoji(currencyCode) { const emojis = { DOP: '🇩🇴', USD: '🇺🇸', EUR: '🇪🇺', MXN: '🇲🇽' }; return emojis[currencyCode] || currencyCode; }
    function generateStars(rating) { let s = ''; for (let i = 1; i <= 5; i++) { s += `<i class="${i <= rating ? 'fas fa-star' : (i - 0.5 <= rating ? 'fas fa-star-half-alt' : 'far fa-star')}"></i>`; } return s; }

    function updateActiveSlideAndDots() {
        const slideElements = document.querySelectorAll('.carousel-slide'); const dotElements = document.querySelectorAll('.progress-indicator .progress-dot');
        slideElements.forEach((s, i) => { s.classList.toggle('active', i === currentProductIndex); s.classList.toggle('fade-in-up', i === currentProductIndex); s.classList.remove('prev'); if(i < currentProductIndex) s.classList.add('prev'); });
        dotElements.forEach((d, i) => { d.classList.toggle('active', i === currentProductIndex); });
        
        const activeProduct = coffeeProducts[currentProductIndex];
        if (activeProduct && slideElements[currentProductIndex]) {
            const activeSlideElement = slideElements[currentProductIndex];
            if (activeProduct.availableSizes) {
                const sizeOptsContainer = activeSlideElement.querySelector('.size-options');
                if (sizeOptsContainer) {
                    sizeOptsContainer.querySelectorAll('.size-option').forEach(opt => {
                        opt.classList.toggle('active', opt.dataset.size === globalSelectedSize);
                        const price = activeProduct.prices[globalCurrency]?.[opt.dataset.size] ?? activeProduct.prices[activeProduct.baseCurrency]?.[opt.dataset.size];
                        if(price !== undefined && opt.querySelector('small')) opt.querySelector('small').textContent = `${currencySymbols[globalCurrency]}${price.toFixed(2)}`;
                    });
                }
            }
            if (activeProduct.id === 'mocha-supreme') {
                const qtyDisp = activeSlideElement.querySelector('#globalQuantityDisplay'); if (qtyDisp) qtyDisp.textContent = globalQuantity;
                const currSel = activeSlideElement.querySelector('.currency-selector');
                if (currSel) currSel.querySelectorAll('.currency-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.currency === globalCurrency));
            }
            updateProductTotalPrice(activeProduct.id);
        }
    }

    function navigateToProduct(index) {
        if (index >= 0 && index < coffeeProducts.length) {
            currentProductIndex = index;
            const newProd = coffeeProducts[currentProductIndex];
            if (newProd.availableSizes && !newProd.availableSizes.includes(globalSelectedSize)) globalSelectedSize = newProd.defaultSize;
            else if (!newProd.availableSizes) globalSelectedSize = coffeeProducts[0].defaultSize; 
            
            if (newProd.availableCurrencies && !newProd.availableCurrencies.includes(globalCurrency)) globalCurrency = newProd.baseCurrency;
            else if (!newProd.availableCurrencies) globalCurrency = coffeeProducts[0].baseCurrency; 
            
            updateActiveSlideAndDots();
        }
    }
    
    function updateProductTotalPrice(productId) {
        const product = coffeeProducts.find(p => p.id === productId);
        const slideElement = document.querySelector(`.carousel-slide[data-product-id="${productId}"]`);
        if (!slideElement) return;
        const displayEl = slideElement.querySelector('.product-total-price');
        if (product && displayEl) {
            let sizeForPrice = globalSelectedSize, qtyForPrice = 1, currForPrice = globalCurrency;

            if(product.availableSizes && product.availableSizes.includes(globalSelectedSize)) {
                sizeForPrice = globalSelectedSize;
            } else {
                sizeForPrice = product.defaultSize; 
            }
            
            if(!product.prices[currForPrice]) {
                currForPrice = product.baseCurrency;
            }

            if (productId === 'mocha-supreme') qtyForPrice = globalQuantity;
            else if (productId === 'mocha-deluxe') {
                const deluxeSizeEl = slideElement.querySelector('.size-options .size-option.active');
                if (deluxeSizeEl) sizeForPrice = deluxeSizeEl.dataset.size;
            }
            
            const price = product.prices[currForPrice]?.[sizeForPrice];
            if (price !== undefined) { displayEl.innerHTML = `Total: ${currencySymbols[currForPrice]}${(price * qtyForPrice).toFixed(2)}`; displayEl.style.display = 'inline-block';}
            else { displayEl.style.display = 'none'; }
        } else if (displayEl) { displayEl.style.display = 'none'; }
    }

    function updateAllProductTotalPrices() { coffeeProducts.forEach(p => updateProductTotalPrice(p.id)); }

    function addEventListenersToDynamicContent() {
        document.querySelectorAll('.progress-indicator .progress-dot').forEach(d => d.addEventListener('click', () => navigateToProduct(parseInt(d.dataset.slideToIndex))));
        carouselContainer.addEventListener('click', function(event) {
            const accordionHeader = event.target.closest('.accordion-header');
            if (accordionHeader) {
                accordionHeader.classList.toggle('active');
                const content = accordionHeader.nextElementSibling;
                content.classList.toggle('active');
                content.style.maxHeight = content.classList.contains('active') ? content.scrollHeight + "px" : null;
            }

            const favButton = event.target.closest('.favorite-btn, .favorite-action-btn');
            if (favButton) { event.stopPropagation(); toggleFavoriteState(favButton.dataset.productId); } 

            const sizeOption = event.target.closest('.size-options .size-option');
            if(sizeOption){
                const prodId = sizeOption.closest('.size-options').dataset.productId, newSize = sizeOption.dataset.size;
                const currentProduct = coffeeProducts.find(p => p.id === prodId);

                sizeOption.parentElement.querySelectorAll('.size-option').forEach(o => o.classList.remove('active')); sizeOption.classList.add('active');
                
                if (currentProduct && currentProduct.availableSizes && currentProduct.availableSizes.includes(newSize)) {
                     globalSelectedSize = newSize; 
                } else if (currentProduct) {
                    globalSelectedSize = currentProduct.defaultSize; 
                }
                
                const currProd = coffeeProducts.find(p => p.id === prodId);
                if(currProd) {
                    const displayCurr = currProd.availableCurrencies?.includes(globalCurrency) ? globalCurrency : currProd.baseCurrency;
                    sizeOption.parentElement.querySelectorAll('.size-option').forEach(o => { 
                        const p = currProd.prices[displayCurr]?.[o.dataset.size]; 
                        if(p!==undefined && o.querySelector('small')) o.querySelector('small').textContent = `${currencySymbols[displayCurr]}${p.toFixed(2)}`; 
                    });
                }
                updateProductTotalPrice(prodId);
            }

            const qtyButton = event.target.closest('.quantity-selector .qty-btn');
            if(qtyButton){
                const prodId = qtyButton.dataset.productId;
                if (prodId === 'mocha-supreme') { 
                    globalQuantity += qtyButton.classList.contains('plus') ? 1 : -1; 
                    if (globalQuantity < 1) globalQuantity = 1; 
                    const qtyDispEl = document.querySelector(`.carousel-slide[data-product-id="${prodId}"] #globalQuantityDisplay`);
                    if(qtyDispEl) qtyDispEl.textContent = globalQuantity;
                    updateProductTotalPrice(prodId); 
                }
            }

            const currencyButton = event.target.closest('.currency-selector .currency-btn');
            if(currencyButton){
                globalCurrency = currencyButton.dataset.currency;
                document.querySelectorAll('.currency-selector .currency-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll(`.currency-selector .currency-btn[data-currency="${globalCurrency}"]`).forEach(b => b.classList.add('active'));
                document.querySelectorAll('.size-options').forEach(soCont => {
                    const pId = soCont.dataset.productId, prod = coffeeProducts.find(p => p.id === pId);
                    if(prod && prod.availableSizes) {
                        const displayCurr = prod.availableCurrencies?.includes(globalCurrency) ? globalCurrency : prod.baseCurrency;
                        soCont.querySelectorAll('.size-option').forEach(opt => { 
                            const pr = prod.prices[displayCurr]?.[opt.dataset.size]; 
                            if(pr!==undefined && opt.querySelector('small')) opt.querySelector('small').textContent = `${currencySymbols[displayCurr]}${pr.toFixed(2)}`; 
                        });
                    }
                });
                updateAllProductTotalPrices();
            }

            const paymentMethodButton = event.target.closest('.payment-methods .payment-method');
            if(paymentMethodButton){ paymentMethodButton.parentElement.querySelectorAll('.payment-method').forEach(x => x.classList.remove('active')); paymentMethodButton.classList.add('active'); }

            const addToCartButton = event.target.closest('.add-to-cart-btn');
            if(addToCartButton){
                const prodId = addToCartButton.dataset.productId, prod = coffeeProducts.find(p => p.id === prodId);
                if (prod) {
                    let sizeToCart = prod.defaultSize; 
                    let qtyToCart = 1;
                    let currToCart = prod.availableCurrencies?.includes(globalCurrency) ? globalCurrency : prod.baseCurrency;

                    if (prod.availableSizes) {
                        const activeSizeEl = document.querySelector(`.carousel-slide[data-product-id="${prodId}"] .size-options .size-option.active`);
                        if (activeSizeEl) {
                            sizeToCart = activeSizeEl.dataset.size;
                        } else if (prod.availableSizes.includes(globalSelectedSize)) {
                            sizeToCart = globalSelectedSize;
                        }
                    }
                    
                    if (prodId === 'mocha-supreme') { qtyToCart = globalQuantity; }
                    
                    const price = prod.prices[currToCart]?.[sizeToCart];
                    if(price===undefined) { showToast("⚠️ Error: Precio no disponible para la selección actual.", 'error'); return; }
                    addToCart(prod.id, prod.name.replace(/<[^>]*>?/gm, ''), price, qtyToCart, sizeToCart, currToCart, prod.image);
                }
            }
            const previewBtn = event.target.closest('#previewOrderBtnDeluxe');
            if (previewBtn) { showToast("ℹ️ Vista previa del pedido (simulado)."); }
        });
    }

    function toggleFavoriteState(productId) { 
        const idx = favorites.indexOf(productId);
        if (idx > -1) { favorites.splice(idx, 1); showToast('💔 Removido de favoritos', 'warning'); }
        else { favorites.push(productId); showToast('❤️ Agregado a favoritos!', 'success'); }
        saveToLocalStorage('brewMasterFavorites_v5', favorites);
        updateFavoriteButtonsUI(productId); 
    }

    function updateFavoriteButtonsUI(prodId, specificSlideElement = null) {
        const isFav = favorites.includes(prodId);
        const slidesToUpdate = specificSlideElement ? [specificSlideElement] : document.querySelectorAll(`.carousel-slide[data-product-id="${prodId}"]`);

        slidesToUpdate.forEach(slide => {
            const favBtn = slide.querySelector('.favorite-btn');
            if (favBtn) { 
                favBtn.classList.toggle('active', isFav); 
                favBtn.querySelector('i').className = isFav ? 'fas fa-heart text-danger' : 'far fa-heart';
            }
            const favActionBtn = slide.querySelector('.favorite-action-btn');
            if (favActionBtn) { 
                const i = favActionBtn.querySelector('i'); 
                if(i) i.className = isFav ? 'fas fa-heart text-danger' : 'far fa-heart'; 
                const s = favActionBtn.querySelector('span'); 
                if(s) s.textContent = isFav ? 'Favorito' : (prodId === 'mocha-premium' ? 'Me Gusta' : 'Añadir Fav.');
            }
        });
    }

    function addToCart(pId, name, price, qty, size, curr, img) {
        if (cart.length > 0 && cart[0].currency !== curr) {
            showToast(`⚠️ No se pueden mezclar monedas en el carrito. Vacía el carrito o continúa con ${cart[0].currency}.`, 'error', 5000);
            return;
        }

        const existIdx = cart.findIndex(i => i.productId === pId && i.size === size && i.currency === curr);
        if (existIdx > -1) cart[existIdx].quantity += qty;
        else cart.push({ productId: pId, name, price, quantity: qty, size, currency: curr, image: img });
        saveToLocalStorage('brewMasterCart_v5', cart); updateCartUI(); showToast(`🛒 "${name}" (${sizeNames[size]}) añadido!`, 'success');
    }

    function removeFromCart(pId, size, curr) { cart = cart.filter(i => !(i.productId === pId && i.size === size && i.currency === curr)); saveToLocalStorage('brewMasterCart_v5', cart); updateCartUI(); renderCartModal(); showToast('🗑️ Artículo removido.', 'info'); }
    function updateCartQuantity(pId, size, curr, newQty) {
        const idx = cart.findIndex(i => i.productId === pId && i.size === size && i.currency === curr);
        if (idx > -1) { cart[idx].quantity = newQty; if (cart[idx].quantity <= 0) removeFromCart(pId, size, curr); else { saveToLocalStorage('brewMasterCart_v5', cart); updateCartUI(); renderCartModal(); } }
    }
    function updateCartUI() { cartBadge.textContent = cart.reduce((sum, i) => sum + i.quantity, 0); }

    function renderCartModal() {
        if (cart.length === 0) { cartModalBody.innerHTML = '<p class="text-center p-4">Tu carrito está vacío.</p>'; cartTotalContainer.style.display = 'none'; checkoutButton.disabled = true; }
        else {
            let html = '', total = 0; const dispCurr = cart[0].currency; 
            cart.forEach(i => { const iTotal = i.price * i.quantity; total += iTotal;
                html += `<div class="cart-item" data-product-id="${i.productId}" data-size="${i.size}" data-currency="${i.currency}"><img src="${i.image}" alt="${i.name}"><div class="cart-item-details"><h6>${i.name}</h6><p>Tamaño: ${sizeNames[i.size]} | Precio: ${currencySymbols[i.currency]}${i.price.toFixed(2)}</p><p>Cantidad: <button class="cart-qty-change btn btn-sm btn-outline-secondary py-0 px-1" data-change="-1">-</button><span class="mx-1">${i.quantity}</span><button class="cart-qty-change btn btn-sm btn-outline-secondary py-0 px-1" data-change="1">+</button> | Total: ${currencySymbols[i.currency]}${iTotal.toFixed(2)}</p></div><div class="cart-item-actions"><button class="remove-from-cart-btn btn btn-sm text-danger" title="Eliminar"><i class="fas fa-trash-alt"></i></button></div></div>`;
            });
            cartModalBody.innerHTML = html; cartModalTotal.textContent = `${currencySymbols[dispCurr]}${total.toFixed(2)}`;
            cartTotalContainer.style.display = 'block'; checkoutButton.disabled = false;
            cartModalBody.querySelectorAll('.remove-from-cart-btn').forEach(b => b.addEventListener('click', function() { const itemDiv = this.closest('.cart-item'); removeFromCart(itemDiv.dataset.productId, itemDiv.dataset.size, itemDiv.dataset.currency); }));
            cartModalBody.querySelectorAll('.cart-qty-change').forEach(b => b.addEventListener('click', function() {
                const itemDiv = this.closest('.cart-item'), item = cart.find(ci => ci.productId === itemDiv.dataset.productId && ci.size === itemDiv.dataset.size && ci.currency === itemDiv.dataset.currency);
                if (item) updateCartQuantity(itemDiv.dataset.productId, itemDiv.dataset.size, itemDiv.dataset.currency, item.quantity + parseInt(this.dataset.change));
            }));
        }
    }
    cartIconContainer.addEventListener('click', () => { renderCartModal(); cartModalElement.show(); });
    
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            renderPaymentGatewayModal();
            paymentGatewayModalElement.show();
            cartModalElement.hide();
        } else {
            showToast("🛒 Tu carrito está vacío.", 'warning');
        }
    });

    function renderPaymentGatewayModal() {
        let summaryHTML = ''; let totalToPay = 0;
        const paymentCurrency = cart.length > 0 ? cart[0].currency : globalCurrency;
        cart.forEach(item => { const itemTotal = item.price * item.quantity; totalToPay += itemTotal;
            summaryHTML += `<li class="list-group-item d-flex justify-content-between align-items-center"><div>${item.name} (${sizeNames[item.size]}) <small class="text-muted">x ${item.quantity}</small></div><span class="badge bg-primary-custom rounded-pill">${currencySymbols[item.currency]}${itemTotal.toFixed(2)}</span></li>`;
        });
        paymentItemList.innerHTML = summaryHTML; paymentTotalAmount.textContent = `${currencySymbols[paymentCurrency]}${totalToPay.toFixed(2)}`;
        paymentForm.classList.remove('was-validated'); 
    }

    confirmPaymentButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (paymentForm.checkValidity() === false) { 
            paymentForm.classList.add('was-validated'); 
            showToast("⚠️ Por favor, completa todos los campos de pago requeridos.", 'error'); 
            return; 
        }
        showToast('⏳ Procesando pago...', 'info');
        confirmPaymentButton.disabled = true;

        const cartDataForInvoice = JSON.parse(JSON.stringify(cart)); // Deep copy for invoice

        setTimeout(() => {
            showToast('✅ ¡Pago Exitoso!', 'success'); 
            generateAndShowInvoiceContent(cartDataForInvoice); // Pass copied data
            
            invoiceModalElement.show(); 
            paymentGatewayModalElement.hide();
            paymentForm.classList.remove('was-validated'); 
            confirmPaymentButton.disabled = false;
            
            cart = []; 
            saveToLocalStorage('brewMasterCart_v5', cart); 
            updateCartUI();
        }, 2000);
    });

    function generateAndShowInvoiceContent(invoiceCartData) {
        const orderDate = new Date();
        const orderNumber = `BM-${orderDate.getFullYear()}${(orderDate.getMonth() + 1).toString().padStart(2, '0')}${orderDate.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 9000 + 1000)}`;
        let itemsHTML = ''; let subtotal = 0; const taxRate = 0.18; 
        
        const currentCartForInvoice = invoiceCartData || []; 

        if (!Array.isArray(currentCartForInvoice)) {
            console.error("Invoice cart data received is not an array!", currentCartForInvoice);
            currentCartForInvoice = [];
        }
        
        const cartDispCurr = currentCartForInvoice.length > 0 && currentCartForInvoice[0].currency 
                           ? currentCartForInvoice[0].currency 
                           : globalCurrency; 

        currentCartForInvoice.forEach(item => { 
            if (item && typeof item.price === 'number' && typeof item.quantity === 'number' && item.name && item.size) {
                const iTotal = item.price * item.quantity; 
                subtotal += iTotal;
                itemsHTML += `<tr>
                                <td class="item-name">${item.name} (${sizeNames[item.size]})</td>
                                <td class="item-qty text-center">${item.quantity}</td>
                                <td class="item-price text-end">${currencySymbols[item.currency || cartDispCurr]}${item.price.toFixed(2)}</td>
                                <td class="item-total text-end">${currencySymbols[item.currency || cartDispCurr]}${iTotal.toFixed(2)}</td>
                              </tr>`;
            } else {
                console.warn("Skipping invalid item during invoice generation:", item);
            }
        });
        const taxes = subtotal * taxRate; const grandTotal = subtotal + taxes;
        const cardNameValue = document.getElementById('cardName') ? document.getElementById('cardName').value : 'Cliente Fiel';

        invoiceContentForPdf.innerHTML = `
            <div class="invoice-header-pdf">
                <img src="img/IMG0.png" alt="BrewMaster Pro Logo">
                <h2>BrewMaster Pro</h2>
                <p>¡Gracias por tu compra!</p>
            </div>
            <div class="invoice-meta-grid">
                <div class="invoice-details-pdf">
                    <p><strong>Orden #:</strong> ${orderNumber}</p>
                    <p><strong>Fecha:</strong> ${orderDate.toLocaleDateString('es-DO', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                    <p><strong>Hora:</strong> ${orderDate.toLocaleTimeString('es-DO', {hour: '2-digit', minute: '2-digit'})}</p>
                </div>
                <div class="invoice-customer-pdf text-end-pdf">
                    <p><strong>Cliente:</strong> ${cardNameValue}</p>
                    <p><strong>Email:</strong> cliente@example.com (Simulado)</p>
                    <p><strong>Método Pago:</strong> Tarjeta (Simulado)</p>
                </div>
            </div>
            <table class="invoice-items-table-pdf">
                <thead><tr><th>Producto</th><th class="text-center">Cant.</th><th class="text-end">P/U</th><th class="text-end">Total</th></tr></thead>
                <tbody>${itemsHTML}</tbody>
            </table>
            <div class="invoice-summary-pdf">
                <p>Subtotal: <span class="float-end">${currencySymbols[cartDispCurr]}${subtotal.toFixed(2)}</span></p>
                <p>ITBIS (${(taxRate * 100).toFixed(0)}%): <span class="float-end">${currencySymbols[cartDispCurr]}${taxes.toFixed(2)}</span></p>
                <hr style="margin: 5px 0;">
                <p class="grand-total-pdf"><strong>Total General:</strong> <span class="float-end">${currencySymbols[cartDispCurr]}${grandTotal.toFixed(2)}</span></p>
            </div>
            <div class="invoice-footer-pdf">
                <p>Este es un recibo simulado. Válido para fines demostrativos.</p>
                <p>Para cualquier consulta, contacte a soporte@brewmaster.pro</p>
                <p>© ${orderDate.getFullYear()} BrewMaster Pro. Todos los derechos reservados.</p>
            </div>`;
    }
    
    printInvoiceButton.addEventListener('click', () => {
        const contentToPrint = invoiceContentForPdf.innerHTML; 
        const printWindow = window.open('', '_blank', 'height=800,width=1000');
        printWindow.document.write('<html><head><title>Factura BrewMaster Pro</title>');
        printWindow.document.write('<link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">');
        printWindow.document.write('<link rel="stylesheet" href="style.css">'); 
        printWindow.document.write('<style>body{margin:20px;font-family:"Poppins",sans-serif}#invoiceContentForPdf{transform:scale(1);width:100%!important; box-shadow:none!important; border:none!important;} @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.modal-footer,.btn,.no-print, .app-header, .progress-indicator, .carousel-container{display:none!important}#invoiceContentForPdf{box-shadow:none!important;border:none!important; margin:0; padding:0;} .invoice-header-pdf img {max-width:80px;}}</style>');
        printWindow.document.write('</head><body><div id="invoiceContentForPdf">');
        printWindow.document.write(contentToPrint);
        printWindow.document.write('</div></body></html>');
        printWindow.document.close(); 
        printWindow.focus(); 
        setTimeout(() => { 
            printWindow.print(); 
            printWindow.close(); 
        }, 750); 
        showToast('🖨️ Preparando impresión...', 'info');
    });

    downloadPdfButton.addEventListener('click', async () => {
        showToast('📄 Generando PDF, por favor espera...', 'info'); 
        downloadPdfButton.disabled = true; 
        printInvoiceButton.disabled = true;
        
        const { jsPDF } = window.jspdf; 
        const content = document.getElementById('invoiceContentForPdf');
        
        const originalBodyWidth = document.body.style.width;
        document.body.style.width = '800px'; 

        try {
            const images = Array.from(content.getElementsByTagName('img'));
            const imagePromises = images.map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => { img.onload = img.onerror = resolve; });
            });
            await Promise.all(imagePromises);

            const canvas = await html2canvas(content, { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                width: content.scrollWidth, 
                height: content.scrollHeight, 
                windowWidth: content.scrollWidth,
                windowHeight: content.scrollHeight
            });
            
            document.body.style.width = originalBodyWidth; 

            const imgData = canvas.toDataURL('image/jpeg', 0.92); 
            const pdf = new jsPDF({ 
                orientation: 'p', 
                unit: 'mm', 
                format: 'a4', 
                putOnlyUsedFonts:true, 
                compress: true 
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            
            const margin = 15; 
            const contentWidth = pdfWidth - 2 * margin;
            const contentHeight = (imgProps.height * contentWidth) / imgProps.width;
            
            let heightLeft = contentHeight;
            let position = margin; 

            pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
            heightLeft -= (pdfHeight - 2 * margin);

            while (heightLeft > 0) {
                position = margin - contentHeight + heightLeft; 
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', margin, position, contentWidth, contentHeight);
                heightLeft -= (pdfHeight - 2 * margin);
            }
            
            const orderDate = new Date(); 
            pdf.save(`Factura-BrewMaster-${orderDate.toISOString().slice(0,10)}.pdf`);
            showToast('✅ PDF generado y descargado!', 'success');
        } catch (error) { 
            console.error("Error generando PDF:", error); 
            showToast('⚠️ Error al generar PDF. Revisa la consola.', 'error', 5000);
            document.body.style.width = originalBodyWidth; 
        } finally { 
            downloadPdfButton.disabled = false; 
            printInvoiceButton.disabled = false; 
        }
    });

    function saveToLocalStorage(key, data) { localStorage.setItem(key, JSON.stringify(data)); }
    function loadFromLocalStorage(key) { const d = localStorage.getItem(key); return d ? JSON.parse(d) : null; }
    
    let touchStartX = 0;
    carouselContainer.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, { passive: true });
    carouselContainer.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX; const swipeThreshold = 40;
        if (touchEndX < touchStartX - swipeThreshold) navigateToProduct((currentProductIndex + 1) % coffeeProducts.length);
        if (touchEndX > touchStartX + swipeThreshold) navigateToProduct((currentProductIndex - 1 + coffeeProducts.length) % coffeeProducts.length);
    }, { passive: true });

    const cardExpiryInput = document.getElementById('cardExpiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 16);
        });
    }
     const cardCVCInput = document.getElementById('cardCVC');
    if (cardCVCInput) {
        cardCVCInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }

    function initializeApp() {
        renderInitialSlidesAndDots(); 
        updateCartUI();
        coffeeProducts.forEach(p => updateFavoriteButtonsUI(p.id)); 
    }
});