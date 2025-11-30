// backend/routes/auth.js

// Importa o módulo Router do Express
const express = require('express');
const router = express.Router();

// 1. CORREÇÃO DE NOME: Importa as funções de lógica do Controller de Autenticação
//    (Assumindo que o arquivo do controller é 'authController.js')
const authController = require('/controllers/authController'); 
// NOTA: Se o seu arquivo for 'AuthController.js', mantenha o nome 'AuthController'
// mas vamos seguir o padrão minúsculo 'authController'.

// -------------------------------------------------------------------------
// ROTAS DE REGISTRO E LOGIN (Usa E-mail e Senha)
// -------------------------------------------------------------------------

// Rota POST para Cadastro de Novos Médicos
// Endpoint: /api/auth/register
// 2. CORREÇÃO DE NOME: De 'cadastro' para 'register' para consistência
router.post('/register', authController.registrarMedico);

// Rota POST para Login do Médico
// Endpoint: /api/auth/login
router.post('/login', authController.loginMedico);

// -------------------------------------------------------------------------
// ROTAS DE AUTENTICAÇÃO DE MÚLTIPLOS FATORES (MFA)
// -------------------------------------------------------------------------

// Rota POST para Iniciar a Configuração de MFA (Gera QR Code)
// Endpoint: /api/auth/mfa/setup
// 3. ADIÇÃO CRÍTICA: Rota para iniciar a configuração de MFA
router.post('/mfa/setup', authController.setupMfa);

// Rota POST para Verificar o Código MFA no Login
// Endpoint: /api/auth/mfa/verify
// 4. ADIÇÃO CRÍTICA: Rota para validar o código TOTP
router.post('/mfa/verify', authController.verifyMfa);


// --- Rota GET para Perfil (Exemplo Protegido, precisa de Middleware) ---
/* // Exemplo de rota que necessitaria de um middleware (ex: verificarToken)
// router.get('/perfil', authMiddleware.verificarToken, authController.getPerfil); 
*/ 

module.exports = router;