document.addEventListener('DOMContentLoaded', function() {

    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    const quantityInputs  = document.querySelectorAll('.quantity-input');

    // Diminuir quantidade
    decreaseButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            let currentValue = parseInt(quantityInputs[index].value);
            if (currentValue > 1) {
                quantityInputs[index].value = currentValue - 1;
                updateCartTotals();
            }
        });
    });

    // Aumentar quantidade
    increaseButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            let currentValue = parseInt(quantityInputs[index].value);
            if (currentValue < 10) {
                quantityInputs[index].value = currentValue + 1;
                updateCartTotals();
            }
        });
    });

    // Alteração manual de quantidade no input
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
            updateCartTotals();
        });
    });

    
    const removeButtons = document.querySelectorAll('.remove-item');

    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const confirmRemove = confirm('Tem certeza que deseja remover este item da sacola?');
            if (confirmRemove) {
                
                window.location.href = 'index.html';
            }
        });
    });

    
    const cepInputCart       = document.getElementById('cep-input-cart');
    const calculateButtonCart = document.getElementById('calculate-shipping-cart');
    const shippingResultCart  = document.getElementById('shipping-result-cart');

    if (calculateButtonCart) {
        calculateButtonCart.addEventListener('click', function() {
            if (cepInputCart && cepInputCart.value.trim() !== '') {
                if (shippingResultCart) {
                    shippingResultCart.innerHTML = `
                        <div class="shipping-option">
                            <div>
                                <div class="shipping-type">Entrega padrão</div>
                                <div class="shipping-estimate">Até 2 dias úteis</div>
                            </div>
                            <div class="shipping-price">R$ 19,90</div>
                        </div>
                    `;
                    shippingResultCart.classList.add('active');
                    updateCartTotals(); 
                }
            } else {
                if (shippingResultCart) {
                    shippingResultCart.innerHTML = '<p>Por favor, digite um CEP válido.</p>';
                    shippingResultCart.classList.add('active');
                }
            }
        });
    }

    
    const noCepLink = document.querySelector('.no-cep-link');

    if (noCepLink) {
        noCepLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(
                'https://buscacepinter.correios.com.br/app/endereco/index.php',
                '_blank'
            );
        });
    }

    
    const checkoutButton = document.getElementById('checkout-button');

    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            window.location.href = 'checkout.html';
        });
    }

    
    function updateCartTotals() {
        const quantityInput = document.querySelector('.quantity-input');
        if (!quantityInput) return;
        const quantity  = parseInt(quantityInput.value, 10) || 1;
        const unitPrice = 99.54; // Valor unitário fixo do produto
        const subtotal  = quantity * unitPrice;
        const shipping  = 19.90; // Valor fixo do frete (pode ser dinâmico futuramente)
        const total     = subtotal + shipping;

        // Atualizar valores no resumo do carrinho
        const summaryRows = document.querySelectorAll('.summary-row');
        if (summaryRows.length >= 3) {
            summaryRows[0].querySelector('span:last-child').textContent = `R$ ${subtotal.toFixed(2)}`;
            summaryRows[1].querySelector('span:last-child').textContent = `R$ ${shipping.toFixed(2)}`;
            summaryRows[2].querySelector('span:last-child').textContent = `R$ ${total.toFixed(2)}`;
        }

        // Salvar dados no localStorage para uso no checkout/revisão
        localStorage.setItem('cartData', JSON.stringify({
            quantity,
            unitPrice,
            shipping,
            subtotal,
            total
        }));
    }

    // Inicializa o resumo ao carregar a página
    updateCartTotals();
});
