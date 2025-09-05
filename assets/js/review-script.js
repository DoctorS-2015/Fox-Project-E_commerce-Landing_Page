document.addEventListener('DOMContentLoaded', function() {
    /**
     * ============================
     * VALIDAÇÃO INICIAL
     * ============================
     * - Verifica se existem dados de checkout.
     * - Caso não existam, o usuário é redirecionado ao checkout.
     */
    const checkoutDataString = localStorage.getItem('checkoutData');
    if (!checkoutDataString) {
        alert('Nenhum dado de pedido encontrado. Redirecionando para o checkout.');
        window.location.href = 'checkout.html';
        return;
    }
    const checkoutData = JSON.parse(checkoutDataString);

    /**
     * ============================
     * DADOS DE ENTREGA
     * ============================
     */
    document.getElementById('review-address').textContent      = checkoutData.address      || '';
    document.getElementById('review-number').textContent       = checkoutData.number       || '';
    document.getElementById('review-complement').textContent   = checkoutData.complement   || '';
    document.getElementById('review-neighborhood').textContent = checkoutData.neighborhood || '';
    document.getElementById('review-city').textContent         = checkoutData.city         || '';
    document.getElementById('review-state').textContent        = checkoutData.state        || '';
    document.getElementById('review-cep').textContent          = checkoutData.cep          || '';
    document.getElementById('review-instructions').textContent = checkoutData.instructions || '';

    /**
     * ============================
     * DADOS PESSOAIS
     * ============================
     */
    document.getElementById('review-full-name').textContent = checkoutData.fullName || '';
    document.getElementById('review-email').textContent     = checkoutData.email    || '';
    document.getElementById('review-phone').textContent     = checkoutData.phone    || '';
    document.getElementById('review-cpf').textContent       = checkoutData.cpf      || '';

    /**
     * ============================
     * DADOS DO PEDIDO
     * ============================
     */
    const orderItemsContainer = document.getElementById('review-order-items');
    const product = checkoutData.product;

    if (product) {
        // Produto principal
        const itemElement = document.createElement('div');
        itemElement.className = 'review-order-item';
        itemElement.innerHTML = `
            <div class="review-order-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="review-order-details">
                <div class="review-order-title">${product.name}</div>
                <div class="review-order-price">R$ ${product.price.toFixed(2)}</div>
                <div class="review-order-quantity">Quantidade: ${product.quantity}</div>
            </div>
        `;
        orderItemsContainer.appendChild(itemElement);

        // Brinde incluso
        const giftElement = document.createElement('div');
        giftElement.className = 'review-order-item';
        giftElement.innerHTML = `
            <div class="review-order-image">
                <img src="/assets/images/cinto.png" alt="Brinde: Cinto FOX Leather em Couro Preto">
            </div>
            <div class="review-order-details">
                <div class="review-order-title">Brinde: Cinto FOX Leather em Couro Preto</div>
                <div class="review-order-price">Grátis</div>
                <div class="review-order-quantity">Quantidade: 1</div>
            </div>
        `;
        orderItemsContainer.appendChild(giftElement);
    }

    /**
     * ============================
     * VALORES (Subtotal, Frete, Total)
     * ============================
     */
    const subtotal = product ? product.price * product.quantity : 0;
    const shipping = checkoutData.shipping ? checkoutData.shipping.price : 0;
    const total    = subtotal + shipping;

    document.getElementById('review-subtotal').textContent     = subtotal.toFixed(2);
    document.getElementById('review-shipping').textContent     = shipping.toFixed(2);
    document.getElementById('review-total-final').textContent  = total.toFixed(2);

    /**
     * ============================
     * PAGAMENTO VIA PIX (Simulado)
     * ============================
     */
    const pixCode = '00020126580014br.gov.bcb.pix01362c271911-0df2-44aa-b81d-f3b4e0f5bda85204000053039865406204.855802BR5925DWTEC SERVICOS DE COMPUTA6007Pacajus6211050726f787963041EE8';
    const finishPixButton = document.getElementById('finish-pix-payment');

    if (finishPixButton) {
        finishPixButton.addEventListener('click', function() {
            // Cria modal de pagamento PIX
            const pixPaymentModal = document.createElement('div');
            pixPaymentModal.className = 'pix-payment-modal';
            pixPaymentModal.innerHTML = `
                <div class="pix-payment-content">
                    <h3 class="pix-payment-title">Pagamento via PIX</h3>
                    <p class="pix-payment-subtitle">Valor total: R$ ${total.toFixed(2)}</p>
                    <div class="pix-qrcode-container">
                        <img src="/assets/images/qr-code.png" alt="QR Code PIX" class="pix-qrcode">
                        <p>Escaneie o QR Code com o aplicativo do seu banco</p>
                    </div>
                    <div class="pix-code-container">
                        <p class="pix-code">${pixCode}</p>
                        <button class="copy-button" id="copy-pix-code"><i class="fas fa-copy"></i></button>
                    </div>
                    <div class="pix-payment-buttons">
                        <button class="pix-payment-button pix-payment-button-primary" id="pix-payment-confirm">
                            Já concluí o pagamento! ✓
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(pixPaymentModal);

            // Animação de exibição
            setTimeout(() => pixPaymentModal.classList.add('active'), 10);

            /**
             * COPIAR CÓDIGO PIX
             */
            document.getElementById('copy-pix-code').addEventListener('click', function() {
                navigator.clipboard.writeText(pixCode).then(() => {
                    const copySuccess = document.createElement('div');
                    copySuccess.className = 'copy-success';
                    copySuccess.textContent = 'Código PIX copiado!';
                    document.body.appendChild(copySuccess);

                    setTimeout(() => copySuccess.classList.add('active'), 10);
                    setTimeout(() => {
                        copySuccess.classList.remove('active');
                        setTimeout(() => document.body.removeChild(copySuccess), 300);
                    }, 2000);
                }).catch(err => {
                    console.error('Erro ao copiar PIX:', err);
                    alert('Não foi possível copiar o código PIX. Copie manualmente.');
                });
            });

            /**
             * CONFIRMAÇÃO DE PAGAMENTO
             */
            document.getElementById('pix-payment-confirm').addEventListener('click', function() {
                pixPaymentModal.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(pixPaymentModal);

                    // Modal de confirmação
                    const modalOverlay = document.createElement('div');
                    modalOverlay.className = 'modal-overlay';
                    modalOverlay.innerHTML = `
                        <div class="modal-content">
                            <h3 class="modal-title">Pedido Finalizado com Sucesso!</h3>
                            <p class="modal-message">
                                Seu pedido foi registrado e os dados foram salvos. 
                                Vamos confirmar seu pagamento e em até 1 hora você receberá a confirmação no seu e-mail.
                                <br>
                                Atualizações sobre envio e transporte também serão enviadas.
                            </p>
                            <div class="modal-buttons">
                                <button class="modal-button modal-button-primary" id="modal-confirm">OK</button>
                            </div>
                        </div>
                    `;
                    document.body.appendChild(modalOverlay);

                    // Exibir modal
                    setTimeout(() => modalOverlay.classList.add('active'), 10);

                    // Confirmação final
                    document.getElementById('modal-confirm').addEventListener('click', function() {
                        saveOrderData(checkoutData);
                        modalOverlay.classList.remove('active');
                        setTimeout(() => {
                            document.body.removeChild(modalOverlay);
                            window.location.href = 'obrigado.html';
                        }, 300);
                    });
                }, 300);
            });
        });
    }

    /**
     * ============================
     * FUNÇÕES DE SUPORTE
     * ============================
     */
    function saveOrderData(data) {
        data.timestamp = new Date().toISOString();
        if (!data.orderId) data.orderId = generateOrderId();

        const previousOrdersString = localStorage.getItem('allOrders');
        let allOrders = previousOrdersString ? JSON.parse(previousOrdersString) : [];
        allOrders.push(data);

        localStorage.setItem('allOrders', JSON.stringify(allOrders));
        localStorage.setItem('lastOrder', JSON.stringify(data));
        localStorage.removeItem('checkoutData'); // limpa dados de checkout

        console.log('Pedido salvo:', data);
    }

    function generateOrderId() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${timestamp}${random}`;
    }
});
