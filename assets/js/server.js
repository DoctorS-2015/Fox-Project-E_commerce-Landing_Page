// ======================================================
// Arquivo: server.js
// Descrição: Backend minimalista para registrar e consultar pedidos
// ======================================================

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// ------------------------------------------------------
// Configuração de diretório para salvar pedidos
// ------------------------------------------------------
const ORDERS_DIR = path.join(__dirname, 'orders');

// Garante que a pasta "orders" exista
if (!fs.existsSync(ORDERS_DIR)) {
    fs.mkdirSync(ORDERS_DIR, { recursive: true });
}

// ------------------------------------------------------
// Middlewares
// ------------------------------------------------------
app.use(cors());            // Permite requisições de diferentes origens (frontend ↔ backend)
app.use(express.json());    // Habilita parsing de JSON no corpo das requisições

// ------------------------------------------------------
// Rota: Criar um novo pedido
// ------------------------------------------------------
app.post('/api/orders', (req, res) => {
    try {
        const orderData = req.body;

        // Validação mínima de campos obrigatórios
        if (!orderData || !orderData.orderId || !orderData.fullName) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        // Gera timestamp caso não tenha sido enviado
        if (!orderData.timestamp) {
            orderData.timestamp = new Date().toISOString();
        }

        // Salvar pedido individual em JSON
        const fileName = `order_${orderData.orderId}.json`;
        const filePath = path.join(ORDERS_DIR, fileName);
        fs.writeFileSync(filePath, JSON.stringify(orderData, null, 2));

        // Atualizar o índice de pedidos
        updateOrdersIndex(orderData);

        res.status(201).json({
            success: true,
            message: 'Pedido recebido com sucesso',
            orderId: orderData.orderId
        });
    } catch (error) {
        console.error('Erro ao processar pedido:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ------------------------------------------------------
// Rota: Listar todos os pedidos registrados
// ------------------------------------------------------
app.get('/api/orders', (req, res) => {
    try {
        const indexPath = path.join(ORDERS_DIR, 'orders_index.json');

        if (!fs.existsSync(indexPath)) {
            return res.json([]); // Caso não exista índice, retorna array vazio
        }

        const ordersIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
        res.json(ordersIndex);
    } catch (error) {
        console.error('Erro ao obter pedidos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ------------------------------------------------------
// Função auxiliar: Atualiza o índice de pedidos
// ------------------------------------------------------
function updateOrdersIndex(newOrder) {
    const indexPath = path.join(ORDERS_DIR, 'orders_index.json');
    let ordersIndex = [];

    // Carrega índice existente se já houver
    if (fs.existsSync(indexPath)) {
        ordersIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    }

    // Adiciona o novo pedido e salva o índice atualizado
    ordersIndex.push(newOrder);
    fs.writeFileSync(indexPath, JSON.stringify(ordersIndex, null, 2));
}

// ------------------------------------------------------
// Inicialização do servidor
// ------------------------------------------------------
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
