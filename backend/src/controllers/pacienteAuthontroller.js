// backend/controllers/pacienteAuthController.js

const Paciente = require('../models/Paciente');
const Documento = require('../models/Documento'); // Para ver o histórico
// const bcrypt = require('bcryptjs'); // Assumido para comparação de senha
// const jwt = require('jsonwebtoken'); // Assumido para token JWT

// 1. LOGIN DO PACIENTE
exports.loginPaciente = async (req, res) => {
    const { cpf, senha } = req.body;

    // Busca o paciente pelo CPF
    const paciente = await Paciente.findOne({ cpf }).select('+senha_hash');
    
    if (!paciente) {
        return res.status(401).json({ message: "CPF não cadastrado." });
    }

    // Compara a senha (simulação)
    // const senhaValida = await bcrypt.compare(senha, paciente.senha_hash);
    const senhaValida = (senha === "simulacao_senha_paciente"); 
    
    if (!senhaValida) {
        return res.status(401).json({ message: "Senha incorreta." });
    }

    // Emite o token JWT para o paciente
    // const token = jwt.sign({ id: paciente._id, role: 'paciente' }, 'PACIENTE_SECRET', { expiresIn: '1h' });
    const token = "JWT_PACIENTE_SIMULADO";
    
    res.json({ token, message: "Login do paciente bem-sucedido." });
};

// 2. BUSCAR HISTÓRICO DE DOCUMENTOS DO PACIENTE (Área privada)
exports.getHistoricoDocumentos = async (req, res) => {
    const pacienteCpf = req.pacienteCpf; // Assumido que o CPF foi extraído do token
    
    try {
        // Busca todos os documentos que foram emitidos para este CPF
        const documentos = await Documento.find({ cpf_paciente: pacienteCpf })
            .sort({ data_emissao: -1 }); // Mais recentes primeiro

        if (documentos.length === 0) {
            return res.status(404).json({ message: "Nenhum documento emitido encontrado para este CPF." });
        }

        res.json(documentos);

    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar histórico." });
    }
};

// ... Outras funções (ex: redefinir senha do paciente)