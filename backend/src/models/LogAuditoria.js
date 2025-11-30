// backend/models/LogAuditoria.js

const mongoose = require('mongoose');

const LogAuditoriaSchema = new mongoose.Schema({
    id_medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medico',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    acao: {
        type: String, // Ex: 'LOGIN_SUCESSO', 'EMISSAO_NOVA', 'ATUALIZACAO_VALIDADE'
        required: true
    },
    ip_origem: {
        type: String,
        default: '0.0.0.0'
    },
    detalhes: {
        type: Object, // Armazena dados JSON do evento (paciente CPF, motivo, etc.)
        required: true
    }
});

module.exports = mongoose.model('LogAuditoria', LogAuditoriaSchema);