// backend/src/controllers/CarteirinhaController.js

const { Medico, Carteirinha } = require('../models/index'); // Assumindo index.js na pasta models
const QRService = require('../services/QRGeneratorService');
const moment = require('moment'); 

// --- FUNÇÃO 1: Emissão da Carteirinha (POST /api/carteirinhas/emitir) ---
async function emitirCarteirinha(req, res) {
    // ID do médico injetado pelo authMiddleware
    const id_medico = req.medicoId; 
    const { nome_paciente, cpf_paciente, motivo, data_validade } = req.body;

    try {
        // 1. Validação de Data
        const dataValidadeMoment = moment(data_validade, 'YYYY-MM-DD');

        if (!dataValidadeMoment.isValid() || dataValidadeMoment.isBefore(moment(), 'day')) {
            return res.status(400).json({ mensagem: 'Data de validade inválida (formato YYYY-MM-DD) ou retroativa.' });
        }

        // 2. Gerar Código Único para o QR Code e URL
        const { codigo_validacao, url_qr_code } = QRService.generateQRCodeData();

        // 3. Criar o registro da Carteirinha
        const novaCarteirinha = await Carteirinha.create({
            id_medico,
            nome_paciente,
            cpf_paciente,
            motivo,
            data_emissao: moment().format('YYYY-MM-DD'),
            data_validade, // O Sequelize salva como DATE
            codigo_validacao,
            status: 'ATIVA'
        });

        return res.status(201).json({ 
            mensagem: 'Carteirinha emitida com sucesso.',
            documentoId: novaCarteirinha.id,
            codigoValidacao: codigo_validacao,
            url_qr_code: url_qr_code // URL a ser usada pelo Front-end para gerar a imagem
        });

    } catch (error) {
        console.error('Erro na emissão:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao emitir carteirinha.' });
    }
}


// --- FUNÇÃO 2: Validação da Carteirinha (GET /api/carteirinhas/validar/:codigo) ---
async function validarCarteirinha(req, res) {
    const { codigo } = req.params;

    try {
        // 1. Buscar a carteirinha e incluir os dados do médico emissor
        const carteirinha = await Carteirinha.findOne({ 
            where: { codigo_validacao: codigo },
            include: [{ model: Medico, attributes: ['nome', 'crm', 'especialidade'] }] 
        });

        if (!carteirinha) {
            return res.status(404).json({ status: 'INVALIDO', mensagem: 'Código de validação não encontrado.' });
        }

        const hoje = moment();
        const dataValidade = moment(carteirinha.data_validade);
        
        // 2. Checar a Validade
        if (hoje.isAfter(dataValidade, 'day')) {
            // Se expirada, podemos atualizar o status no BD (opcional)
            if (carteirinha.status !== 'EXPIRADA') {
                carteirinha.update({ status: 'EXPIRADA' });
            }
            return res.status(200).json({ 
                status: 'EXPIRADA', 
                mensagem: `Documento expirado em ${dataValidade.format('DD/MM/YYYY')}.` 
            });
        }

        // 3. Retornar status ATIVA
        return res.status(200).json({
            status: 'ATIVA',
            mensagem: 'Documento válido para assento/fila preferencial.',
            dados: {
                paciente: carteirinha.nome_paciente,
                motivo: carteirinha.motivo,
                validade: dataValidade.format('DD/MM/YYYY'),
                medicoEmissor: `${carteirinha.Medico.nome} (CRM: ${carteirinha.Medico.crm})`
            }
        });

    } catch (error) {
        console.error('Erro na validação:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao validar o documento.' });
    }
}


// --- FUNÇÃO 3: Listar Carteirinhas por Médico (GET /api/carteirinhas/minhas) ---
async function listarCarteirinhasPorMedico(req, res) {
    const id_medico = req.medicoId; // Obtido do token JWT

    try {
        const carteirinhas = await Carteirinha.findAll({
            where: { id_medico },
            attributes: ['id', 'nome_paciente', 'motivo', 'data_validade', 'status', 'data_emissao'],
            order: [['data_emissao', 'DESC']] // Ordena pela mais recente
        });
        
        if (carteirinhas.length === 0) {
            return res.status(200).json({ mensagem: 'Nenhuma carteirinha emitida por este médico.', dados: [] });
        }

        return res.status(200).json(carteirinhas);

    } catch (error) {
        console.error('Erro ao listar carteirinhas:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao listar documentos.' });
    }
}

module.exports = { emitirCarteirinha, validarCarteirinha, listarCarteirinhasPorMedico };