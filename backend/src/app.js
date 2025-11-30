const express = require('express');
const app = express();
const cors = require('cors'); // Para permitir requisições do Front-end
require('../database/index'); // Inicializa a conexão e os modelos do DB

// --- Importação das Rotas ---
const authRoutes = require('./routes/auth');
const carteirinhasRoutes = require('./routes/carteirinhas');

// --- Middlewares Globais ---
app.use(cors()); // Configuração de CORS
app.use(express.json()); // Permite que a API receba dados em formato JSON

// --- Uso das Rotas ---
// Todas as rotas em auth.js terão o prefixo /api/auth
app.use('/api/auth', authRoutes);

// Todas as rotas em carteirinhas.js terão o prefixo /api/carteirinhas
app.use('/api/carteirinhas', carteirinhasRoutes); 

// Definir a porta e iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor QuickMed ID rodando na porta ${PORT}`);
});

// backend/server.js (Trecho)

const pacienteRoutes = require('./routes/pacienteRoutes');
// ... outras importações (medicoRoutes, publicRoutes)

app.use('/api/paciente', pacienteRoutes); // Novo endpoint para o paciente
// app.use('/api/medico', medicoRoutes);
// app.use('/api/public', publicRoutes);