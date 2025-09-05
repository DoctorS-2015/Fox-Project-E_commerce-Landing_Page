document.addEventListener('DOMContentLoaded', function() {
    /**
     * ============================
     * CARROSSEL PRINCIPAL
     * ============================
     */
    const carouselSlides     = document.querySelectorAll('.carousel-slide');
    const carouselPrev       = document.querySelector('.carousel-prev');
    const carouselNext       = document.querySelector('.carousel-next');
    const carouselIndicators = document.querySelectorAll('.indicator');
    let currentSlide         = 0;

    // Miniaturas laterais do produto
    const thumbnailItems = document.querySelectorAll('.product-thumbnails-vertical .thumbnail-item');

    // Exibe um slide específico e atualiza indicadores/miniaturas
    function showSlide(index) {
        if (index < 0) index = carouselSlides.length - 1;
        else if (index >= carouselSlides.length) index = 0;

        carouselSlides.forEach(slide => slide.classList.remove('active'));
        carouselIndicators.forEach(indicator => indicator.classList.remove('active'));
        thumbnailItems.forEach(item => item.classList.remove('active'));

        carouselSlides[index].classList.add('active');
        if (index < carouselIndicators.length) carouselIndicators[index].classList.add('active');
        if (index < thumbnailItems.length) thumbnailItems[index].classList.add('active');

        currentSlide = index;
    }

    // Navegação manual
    if (carouselPrev) carouselPrev.addEventListener('click', () => showSlide(currentSlide - 1));
    if (carouselNext) carouselNext.addEventListener('click', () => showSlide(currentSlide + 1));

    // Indicadores clicáveis
    carouselIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });

    // Miniaturas clicáveis
    thumbnailItems.forEach((item, index) => {
        item.addEventListener('click', () => showSlide(index));
    });

    /**
     * ============================
     * ABAS DE DETALHES DO PRODUTO
     * ============================
     */
    const tabButtons  = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    /**
     * ============================
     * CÁLCULO DE FRETE (simulado)
     * ============================
     */
    const cepInput        = document.getElementById('cep-input');
    const calculateButton = document.getElementById('calculate-shipping');
    const shippingResult  = document.getElementById('shipping-result');

    if (calculateButton) {
        calculateButton.addEventListener('click', function() {
            if (cepInput && cepInput.value.trim() !== '') {
                if (shippingResult) {
                    shippingResult.innerHTML = `
                        <div style="margin-top: 10px; padding: 10px; background-color: #f8f8f8; border-radius: 5px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                <div>
                                    <div style="font-weight: bold;">Entrega padrão</div>
                                    <div style="font-size: 12px; color: #666;">Até 2 dias úteis</div>
                                </div>
                                <div style="color: #1A2B3C; font-weight: bold;">R$ 19,90</div>
                            </div>
                        </div>
                    `;
                }
            } else {
                if (shippingResult) {
                    shippingResult.innerHTML =
                        '<p style="color: #e74c3c; margin-top: 10px;">Por favor, digite um CEP válido.</p>';
                }
            }
        });
    }

    /**
     * ============================
     * BOTÃO DE COMPRAR
     * ============================
     */
    const buyButton = document.querySelector('.buy-button');
    if (buyButton) buyButton.addEventListener('click', () => (window.location.href = 'cart.html'));

    /**
     * ============================
     * AVALIAÇÕES (carregar mais)
     * ============================
     */
    const loadMoreButton = document.querySelector('.load-more-reviews');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            const reviewList = document.querySelector('.review-list');
            const newReviews = `
                <div class="review-item">
                    <div class="reviewer-info">
                        <div class="reviewer-name">Patrícia M.</div>
                        <div class="review-date">20/05/2025</div>
                    </div>
                    <div class="review-rating">
                        <div class="stars">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i>
                            <i class="fas fa-star"></i><i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                    </div>
                    <div class="review-content"><p>Comprei para presentear minha mãe e ela adorou!</p></div>
                </div>
                <div class="review-item">
                    <div class="reviewer-info">
                        <div class="reviewer-name">Fernanda L.</div>
                        <div class="review-date">15/05/2025</div>
                    </div>
                    <div class="review-rating">
                        <div class="stars">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i>
                            <i class="fas fa-star"></i><i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                    </div>
                    <div class="review-content"><p>Simplesmente perfeito!</p></div>
                </div>
            `;
            reviewList.innerHTML += newReviews;

            loadMoreButton.disabled = true;
            loadMoreButton.textContent = 'Todas as avaliações foram carregadas';
            loadMoreButton.style.backgroundColor = '#ccc';
        });
    }

    /**
     * ============================
     * SWIPE / DRAG DO CARROSSEL
     * ============================
     */
    const carousel = document.querySelector('.carousel-container');
    let startX = 0;
    let isDragging = false;

    // Toque (mobile)
    carousel.addEventListener('touchstart', e => (startX = e.touches[0].clientX), false);
    carousel.addEventListener('touchend', e => handleSwipe(e.changedTouches[0].clientX - startX), false);

    // Mouse (desktop)
    carousel.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.clientX;
    });
    carousel.addEventListener('mouseup', e => {
        if (!isDragging) return;
        isDragging = false;
        handleSwipe(e.clientX - startX);
    });

    // Detecta direção do swipe
    function handleSwipe(deltaX) {
        const threshold = 50; // mínimo em px
        if (deltaX > threshold) showSlide(currentSlide - 1); // direita → slide anterior
        else if (deltaX < -threshold) showSlide(currentSlide + 1); // esquerda → próximo slide
    }
});
