// backend/controllers/authController.js - (Trechos Atualizados)

// 1. REGISTRO (Agora exige Email e CRM)
exports.registrarMedico = async (req, res) => {
    const { nome, crm, estado_crm, email, senha } = req.body; // <-- Adicionado email

    // 1. Validação do CRM (Ainda é necessária)
    const crmValido = await validarCrmExterno(crm, estado_crm);
    if (!crmValido) {
        return res.status(400).json({ message: "CRM inválido ou não ativo." });
    }

    try {
        const novoMedico = new Medico({
            nome,
            crm,
            estado_crm,
            email, // <-- Novo campo
            senha: "senha_hash_simulada", 
            crm_validado: true
        });
        await novoMedico.save();

        // ... Registro de Log ...
        res.status(201).json({ message: "Médico registrado com sucesso." });

    } catch (error) {
        // ... tratamento de erro (ex: Email já existe) ...
        res.status(500).json({ message: "Erro ao registrar médico.", error: error.message });
    }
};

// 2. LOGIN PADRÃO (Atualizado para buscar por Email)
exports.loginMedico = async (req, res) => {
    const { email, senha } = req.body; // <-- Recebe email em vez de crm

    const medico = await Medico.findOne({ email }).select('+senha +mfa_secret'); // <-- Busca por email
    if (!medico || medico.senha !== "senha_hash_simulada") { 
        
        // ... Log de Auditoria de falha ...
        return res.status(401).json({ message: "Credenciais inválidas (E-mail ou Senha)." });
    }

    if (medico.mfa_ativado) {
        // ... Lógica MFA ...
        return res.status(202).json({ 
            mfa_required: true,
            token_mfa_temp: "TOKEN_TEMP_SIMULADO"
        });
    }

    // ... Log de Auditoria de sucesso ...
    res.json({ token: "TOKEN_JWT_SIMULADO", mfa_required: false });
};
// ... restante das funções (verifyMfa, etc.) ...