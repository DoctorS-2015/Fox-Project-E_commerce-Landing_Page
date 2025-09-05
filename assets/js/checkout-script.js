document.addEventListener('DOMContentLoaded', function() {
    /**
     * ============================
     * ELEMENTOS DO FORMULÁRIO
     * ============================
     */
    const form             = document.getElementById('checkout-form');
    const continueButton   = document.getElementById('continue-button');
    const cepInput         = document.getElementById('cep');
    const searchCepButton  = document.getElementById('search-cep');

    /**
     * ============================
     * DADOS DO PRODUTO E FRETE
     * ============================
     */
    const productData = {
        name: "Bolsa De Viagem Extra G Preta (Alça de mão e Ombro)",
        price: 99.54,
        image: "/assets/images/bolsaprinc.png",
        quantity: 1
    };

    const shippingData = { price: 19.90, days: 3 };

    // Carregar informações do carrinho se existirem
    const cartDataString = localStorage.getItem('cartData');
    const cartData = cartDataString ? JSON.parse(cartDataString) : null;

    if (cartData) {
        productData.quantity = cartData.quantity; // Quantidade real
        productData.price    = cartData.unitPrice;
        shippingData.price   = cartData.shipping;
    }

    /**
     * ============================
     * RESUMO DO PEDIDO
     * ============================
     * Atualiza os valores exibidos no resumo da página de checkout.
     */
    (function updateCheckoutSummary() {
        const summary = document.querySelector('.checkout-summary');
        if (!summary) return;

        const rows = summary.querySelectorAll('.summary-row');
        const brl = v => (v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        const qty      = productData.quantity || 1;
        const subtotal = productData.price * qty;
        const shipping = shippingData.price;
        const total    = subtotal + shipping;

        const label = `Subtotal (${qty} ${qty > 1 ? 'itens' : 'item'})`;

        rows[0].querySelector('span:first-child').textContent = label;
        rows[0].querySelector('span:last-child').textContent  = brl(subtotal);
        rows[1].querySelector('span:last-child').textContent  = brl(shipping);
        rows[2].querySelector('span:last-child').textContent  = brl(total);
    })();

    /**
     * ============================
     * VALIDAÇÃO DO FORMULÁRIO
     * ============================
     */
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('invalid');
            } else {
                field.classList.remove('invalid');
            }
        });

        return isValid;
    }

    /**
     * ============================
     * BUSCA DE ENDEREÇO POR CEP (ViaCEP)
     * ============================
     */
    function searchAddressByCep() {
        const cep     = cepInput.value.replace(/\D/g, '');
        const spinner = document.getElementById('cep-spinner');

        if (cep.length !== 8) {
            alert('Por favor, digite um CEP válido.');
            return;
        }

        // Mostrar loading e bloquear botão
        spinner.style.display = 'block';
        searchCepButton.disabled = true;

        // Mostrar placeholders enquanto carrega
        document.getElementById('address').value      = 'Carregando...';
        document.getElementById('neighborhood').value = 'Carregando...';
        document.getElementById('city').value         = 'Carregando...';
        document.getElementById('state').value        = '';

        // Requisição ViaCEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao buscar o CEP');
                return response.json();
            })
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado.');
                    document.getElementById('address').value      = '';
                    document.getElementById('neighborhood').value = '';
                    document.getElementById('city').value         = '';
                    document.getElementById('state').value        = '';
                    return;
                }

                // Preencher campos com os dados do ViaCEP
                document.getElementById('address').value      = data.logradouro;
                document.getElementById('neighborhood').value = data.bairro;
                document.getElementById('city').value         = data.localidade;
                document.getElementById('state').value        = data.uf;
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao buscar o CEP. Por favor, tente novamente.');
                document.getElementById('address').value      = '';
                document.getElementById('neighborhood').value = '';
                document.getElementById('city').value         = '';
                document.getElementById('state').value        = '';
            })
            .finally(() => {
                spinner.style.display = 'none';
                searchCepButton.disabled = false;
            });
    }

    // Eventos do CEP
    if (searchCepButton) {
        searchCepButton.addEventListener('click', searchAddressByCep);
    }

    if (cepInput) {
        cepInput.addEventListener('blur', function() {
            if (cepInput.value.replace(/\D/g, '').length === 8) {
                searchAddressByCep();
            }
        });
    }

    /**
     * ============================
     * BOTÃO "CONTINUAR"
     * ============================
     * Valida o formulário, coleta dados e envia para a página de revisão.
     */
    if (continueButton) {
        continueButton.addEventListener('click', function(e) {
            e.preventDefault();

            if (validateForm()) {
                // Captura dos dados do formulário
                const formData    = new FormData(form);
                const customerData = {};

                // Converter FormData em objeto
                for (let [key, value] of formData.entries()) {
                    if (key === 'name') customerData.fullName = value;
                    else if (key === 'phone') customerData.phone = value;
                    else if (key === 'cpf') customerData.cpf = value;
                    else if (key === 'cep') customerData.cep = value;
                    else if (key === 'address') customerData.address = value;
                    else if (key === 'number') customerData.number = value;
                    else if (key === 'complement') customerData.complement = value;
                    else if (key === 'neighborhood') customerData.neighborhood = value;
                    else if (key === 'city') customerData.city = value;
                    else if (key === 'state') customerData.state = value;
                    else if (key === 'delivery-instructions') customerData.instructions = value;
                    else customerData[key] = value;
                }

                // Incluir produto, frete e metadados
                customerData.product   = productData;
                customerData.shipping  = shippingData;
                customerData.timestamp = new Date().toISOString();
                customerData.orderId   = generateOrderId();

                // Salvar dados temporários para a página de revisão
                localStorage.setItem('checkoutData', JSON.stringify(customerData));

                // Persistir pedido no "servidor" (simulado com localStorage)
                saveOrderToServer(customerData);

                // Ir para página de revisão
                window.location.href = 'review.html';
            } else {
                alert('Por favor, preencha todos os campos obrigatórios.');
            }
        });
    }

    /**
     * ============================
     * GERAR ID DO PEDIDO
     * ============================
     */
    function generateOrderId() {
        const timestamp = Date.now().toString().slice(-6);
        const random    = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${timestamp}${random}`;
    }

    /**
     * ============================
     * SIMULAÇÃO DE SALVAR PEDIDO
     * ============================
     * Aqui você pode substituir futuramente por uma API real.
     */
    function saveOrderToServer(orderData) {
        const previousOrdersString = localStorage.getItem('allOrders');
        let allOrders = previousOrdersString ? JSON.parse(previousOrdersString) : [];

        allOrders.push(orderData);
        localStorage.setItem('allOrders', JSON.stringify(allOrders));

        console.log('Pedido salvo:', orderData);
    }

    /**
     * ============================
     * MÁSCARAS DE INPUTS (Telefone, CPF, CEP)
     * ============================
     */
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 2 && value.length <= 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
            } else if (value.length > 6) {
                value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
            }

            e.target.value = value;
        });
    }

    const cpfField = document.getElementById('cpf');
    if (cpfField) {
        cpfField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);

            if (value.length > 3 && value.length <= 6) {
                value = `${value.slice(0, 3)}.${value.slice(3)}`;
            } else if (value.length > 6 && value.length <= 9) {
                value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
            } else if (value.length > 9) {
                value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
            }

            e.target.value = value;
        });
    }

    const cepField = document.getElementById('cep');
    if (cepField) {
        cepField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);

            if (value.length > 5) {
                value = `${value.slice(0, 5)}-${value.slice(5)}`;
            }

            e.target.value = value;
        });
    }
});
