// backend/controllers/emissaoController.js

const Documento = require('../models/Documento');
const LogAuditoria = require('../models/LogAuditoria');
// Assumindo que o Documento.js e a lógica de validade já existem.

// Função auxiliar para gerar um código alfanumérico único
function generateCode() {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
}

// 1. EMITIR NOVA CARTEIRINHA (Atualizado com Logs)
exports.emitirCarteirinha = async (req, res) => {
    const medicoId = req.medicoId; // Obtido do token JWT
    const { nome_paciente, cpf_paciente, motivo, data_validade } = req.body;
    
    const codigo_validacao = generateCode();

    try {
        const novoDocumento = new Documento({
            medico_id: medicoId,
            nome_paciente,
            cpf_paciente,
            motivo,
            data_validade,
            codigo_validacao
        });
        await novoDocumento.save();

        // **AÇÃO:** Registrar LOG de AUDITORIA
        await LogAuditoria.create({
            id_medico: medicoId,
            acao: 'EMISSAO_NOVA',
            ip_origem: req.ip,
            detalhes: { codigo: codigo_validacao, cpf_paciente, validade: data_validade }
        });

        res.status(201).json({ message: "Documento emitido com sucesso.", codigo_validacao });

    } catch (error) {
        res.status(500).json({ message: "Falha na emissão do documento.", error: error.message });
    }
};

// 2. ATUALIZAR VALIDADE (Atualizado com Logs)
exports.atualizarValidade = async (req, res) => {
    const medicoId = req.medicoId;
    const { documento_id, nova_data_validade } = req.body;

    try {
        const documento = await Documento.findOneAndUpdate(
            { _id: documento_id, medico_id: medicoId }, // Garante que o médico é o proprietário
            { data_validade: nova_data_validade },
            { new: true }
        );

        if (!documento) {
            return res.status(404).json({ message: "Documento não encontrado ou acesso negado." });
        }
        
        // **AÇÃO:** Registrar LOG de AUDITORIA
        await LogAuditoria.create({
            id_medico: medicoId,
            acao: 'ATUALIZACAO_VALIDADE',
            ip_origem: req.ip,
            detalhes: { codigo: documento.codigo_validacao, validade_antiga: documento.data_validade, validade_nova: nova_data_validade }
        });

        res.json({ message: "Validade atualizada com sucesso.", documento });

    } catch (error) {
        res.status(500).json({ message: "Erro ao atualizar validade." });
    }
};

// 3. API DE COMPARTILHAMENTO (NOVO - Helper para o Frontend)
// O Frontend chama esta rota para obter o URL base completo.
exports.getShareLink = (req, res) => {
    const { codigo } = req.params;
    
    // URL base deve ser uma variável de ambiente (process.env.FRONTEND_URL)
    const frontendUrl = "https://quickmedid.com"; // Simulação
    
    const fullUrl = `${frontendUrl}/validation.html?code=${codigo}`;
    
    res.json({
        share_url: fullUrl,
        message: `Acesse o QuickMed ID: ${fullUrl}`
    });
};

// As funções getHistorico e validarDocumento (leitura pública) permaneceriam aqui.