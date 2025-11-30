// Importa o módulo Router do Express
const express = require('express');
const router = express.Router();

// Importa o Middleware para proteger as rotas
const authMiddleware = require('../middlewares/authMiddleware');

// Importa as funções de lógica do Controller de Carteirinha
const CarteirinhaController = require('../controllers/CarteirinhaController');

// --- ROTAS PROTEGIDAS (Apenas para Médicos Autenticados) ---

// Rota POST para Emissão de Nova Carteirinha
// Esta rota usa o Middleware 'authMiddleware.verificarToken' para garantir
// que somente um médico logado possa emitir o documento.
// Endpoint: /api/carteirinhas/emitir
router.post('/emitir', authMiddleware.verificarToken, CarteirinhaController.emitirCarteirinha);

// Rota GET para Listar Carteirinhas Emitidas pelo Médico (útil para o dashboard)
// Endpoint: /api/carteirinhas/minhas
router.get('/minhas', authMiddleware.verificarToken, CarteirinhaController.listarCarteirinhasPorMedico);


// --- ROTAS PÚBLICAS (Para Fiscais/Público via QR Code) ---

// Rota GET para Validação da Carteirinha
// Esta rota é pública e não exige token. É acionada quando o QR Code é escaneado.
// Endpoint: /api/carteirinhas/validar/:codigo
router.get('/validar/:codigo', CarteirinhaController.validarCarteirinha);


module.exports = router;