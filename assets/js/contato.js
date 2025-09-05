document.addEventListener('DOMContentLoaded', function() {
    /**
     * ============================
     * ELEMENTOS PRINCIPAIS
     * ============================
     */
    const form         = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    /**
     * ============================
     * EVENTO DE SUBMISSÃO DO FORMULÁRIO
     * ============================
     */
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede envio padrão

        if (validateForm()) {
            // Caso o formulário esteja válido
            formFeedback.textContent = 'Mensagem enviada com sucesso! Agradecemos o seu contato.';
            formFeedback.className   = 'feedback-message success';
            formFeedback.style.display = 'block';

            form.reset(); // Limpa os campos do formulário
        } else {
            // Caso haja erros de validação
            formFeedback.textContent = 'Por favor, corrija os erros antes de enviar.';
            formFeedback.className   = 'feedback-message error';
            formFeedback.style.display = 'block';
        }
    });

    /**
     * ============================
     * FUNÇÃO DE VALIDAÇÃO
     * ============================
     * - Verifica se todos os campos obrigatórios foram preenchidos.
     * - Exibe mensagens de erro abaixo de cada campo inválido.
     */
    function validateForm() {
        let isValid = true;
        const fields = form.querySelectorAll('[required]');

        fields.forEach(field => {
            const errorElement = field.nextElementSibling;

            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('invalid');
                errorElement.textContent = 'Este campo é obrigatório.';
                errorElement.style.display = 'block';
            } else {
                field.classList.remove('invalid');
                errorElement.style.display = 'none';
            }
        });

        return isValid;
    }
});
