// backend/routes/pacienteRoutes.js

const express = require('express');
const router = express.Router();
const pacienteAuthController = require('../controllers/pacienteAuthController');
// const authMiddleware = require('../middleware/authMiddleware'); // Middleware para verificar token

// Rota de Login do Paciente
router.post('/login', pacienteAuthController.loginPaciente);

// Rota para a área privada (exige autenticação do paciente)
router.get('/documentos/historico', 
    // authMiddleware.verifyPatient, // Verifica o token JWT do paciente
    pacienteAuthController.getHistoricoDocumentos
);

module.exports = router;