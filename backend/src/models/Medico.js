// backend/models/Medico.js

const mongoose = require('mongoose');

const MedicoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    // NOVO CAMPO PRINCIPAL PARA LOGIN
    email: { 
        type: String,
        required: true,
        unique: true, // Garante que apenas um médico use este email
        trim: true
    },
    crm: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // ... restante dos campos (estado_crm, senha, mfa_secret, etc.)
    // ...
});

module.exports = mongoose.model('Medico', MedicoSchema);