// Importa o módulo Router do Express
const express = require('express');
const router = express.Router();

// Importa as funções de lógica do Controller de Autenticação
const AuthController = require('../controllers/AuthController');

// Rota POST para Cadastro de Novos Médicos
// Endpoint: /api/auth/cadastro
router.post('/cadastro', AuthController.cadastrarMedico);

// Rota POST para Login do Médico
// Endpoint: /api/auth/login
router.post('/login', AuthController.loginMedico);

// Rota GET para Perfil do Médico (Exemplo de Rota Protegida, se necessário)
// Embora o login não esteja no AuthController, é um bom exemplo de rota de usuário.
// Endpoint: /api/auth/perfil
// Você precisaria de um middleware para checar o token nesta rota!
// router.get('/perfil', authMiddleware.verificarToken, AuthController.getPerfil); 

module.exports = router;