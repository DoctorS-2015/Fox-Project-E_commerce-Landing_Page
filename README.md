# 🛍️ FOX U.S Store – Projeto de E-commerce Front-End

## 📖 Sobre o Projeto

Este é um **projeto front-end de e-commerce** desenvolvido com **HTML5, CSS3 e JavaScript Vanilla (puro)**.  
Ele simula uma jornada de compra completa, desde a escolha do produto até a confirmação do pagamento via PIX.  

O objetivo é demonstrar a aplicação de conceitos fundamentais e boas práticas do **desenvolvimento web moderno**, conciliando **tecnologia**, **design responsivo** e **usabilidade**.

🔗 **[Demo Online do Projeto](#)**  
*(Adicione o link quando publicar no GitHub Pages, Netlify ou Vercel)*  

📸 **Preview do Projeto**  
*(Sugestão: adicione aqui um GIF navegando pelo site)*

---

## ✨ Funcionalidades

✔️ **Página de Produto:**  
Carrossel interativo, miniaturas clicáveis, abas de descrição e avaliações.  

✔️ **Carrinho de Compras:**  
- Controle de quantidade (com validação mínima e máxima)  
- Cálculo de subtotal em tempo real  
- Simulação de cálculo de frete por CEP  

✔️ **Checkout Validado:**  
- Formulário multi-etapas (dados pessoais e endereço)  
- Máscaras automáticas para CPF, telefone e CEP  
- Preenchimento automático de endereço via **API ViaCEP**  

✔️ **Fluxo de Pagamento (Simulado):**  
- Geração de QR Code PIX e código de pagamento  
- Botão de copiar código PIX para área de transferência  
- Modal de confirmação após finalização  

✔️ **Páginas Institucionais:**  
Política de Privacidade, Termos de Uso, Contato e Endereço – simulando um e-commerce completo e confiável.  

✔️ **Responsividade Total:**  
Design adaptável para **desktop, tablet e mobile**.  

---

## 🚀 Tecnologias e Conceitos Aplicados

- **HTML5 Semântico** → melhor estruturação e acessibilidade  
- **CSS3 Avançado** → Flexbox, Grid, Media Queries, microinterações e transições  
- **JavaScript (ES6+)** →  
  - Manipulação do DOM  
  - Validação de formulários e máscaras de input  
  - Controle de estado via `localStorage`  
  - Consumo de API (fetch – ViaCEP)  
- **Experiência do Usuário (UX):**  
  - Feedback visual em tempo real  
  - Navegação simples e intuitiva  
  - Layout limpo e responsivo  

---

## 🛠️ Estrutura do Projeto

```
📂 fox-us-store
 ┣ 📂 assets
 ┃ ┣ 📂 css        # Estilos globais e por página
 ┃ ┣ 📂 js         # Scripts organizados por fluxo (cart, checkout, review)
 ┃ ┗ 📂 images     # Logos, ícones e imagens de produto
 ┣ 📜 index.html   # Página principal do produto
 ┣ 📜 cart.html    # Página do carrinho
 ┣ 📜 checkout.html # Página de checkout
 ┣ 📜 review.html   # Revisão do pedido
 ┣ 📜 obrigado.html # Página de agradecimento
 ┣ 📜 contato.html
 ┣ 📜 endereco.html
 ┣ 📜 politica-de-privacidade.html
 ┣ 📜 termos-de-uso.html
 ┗ 📜 README.md
```

---

## 🏁 Como Executar o Projeto

### 🔹 Opção 1 – Localmente
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/fox-us-store.git
   ```
2. Abra a pasta do projeto:
   ```bash
   cd fox-us-store
   ```
3. Dê duplo clique em `index.html` para abrir no navegador.

### 🔹 Opção 2 – Com servidor local
Caso queira simular também o **back-end minimalista** (`server.js`), instale as dependências e execute:
```bash
npm install
node server.js
```
Servidor rodará em: [http://localhost:3000](http://localhost:3000)

---

## 📌 Diferenciais do Projeto

- **Abordagem realista:** O fluxo foi inspirado em **e-commerces reais**, o que gera proximidade com a prática do mercado.  
- **Escalabilidade:** Estrutura de pastas e código modular permitem fácil expansão para múltiplos produtos ou integração futura com banco de dados.  
- **Equilíbrio Técnico e Estético:** Une boas práticas de código com **UX/UI moderno**, atendendo tanto **recruiters técnicos** quanto **clientes finais**.  

---

## 👤 Autor

**Marcelo Dias**  
🔗 [LinkedIn](#) | 🔗 [Portfólio](#) | 📧 marcelo@email.com  
