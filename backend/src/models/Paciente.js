// backend/models/Paciente.js

const mongoose = require('mongoose');

const PacienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // O paciente pode receber um token único ou senha para acessar a área.
    senha_hash: {
        type: String,
        required: true,
        select: false
    },
    data_registro: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Paciente', PacienteSchema);