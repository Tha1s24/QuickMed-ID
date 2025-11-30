// backend/src/controllers/AuthController.js

const Medico = require('../models/Medico'); // Modelo do Sequelize
const bcrypt = require('bcrypt'); // Para hashing de senhas
const jwt = require('jsonwebtoken'); // Para tokens de sessão
const jwtConfig = require('../config/auth'); // Chave Secreta do JWT

// --- FUNÇÃO 1: Cadastro do Médico ---
async function cadastrarMedico(req, res) {
    const { nome, email, senha, crm, cpf, especialidade } = req.body;

    try {
        // 1. Verificar Duplicidade (CRM, CPF, Email)
        const medicoExistente = await Medico.findOne({ 
            where: { crm: crm } // Exemplo: checando apenas o CRM
        });
        if (medicoExistente) {
            return res.status(400).json({ mensagem: 'CRM ou dados já cadastrados.' });
        }

        // 2. Criptografar a Senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // 3. Criar o novo registro no banco
        const novoMedico = await Medico.create({
            nome, 
            email, 
            senha_hash: senhaHash, 
            crm, 
            cpf, 
            especialidade,
            // O campo 'ativo' pode ser definido como FALSE por padrão
            // se você precisar de um processo de aprovação manual após o cadastro.
        });

        return res.status(201).json({ 
            mensagem: 'Cadastro realizado com sucesso. Aguardando ativação.' 
        });

    } catch (error) {
        console.error('Erro no cadastro:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao cadastrar médico.' });
    }
}

// --- FUNÇÃO 2: Login do Médico ---
async function loginMedico(req, res) {
    const { email, senha } = req.body;

    try {
        // 1. Buscar o médico pelo email
        const medico = await Medico.findOne({ where: { email } });
        
        if (!medico) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
        }

        // 2. Checar se a conta está ativa (se houver processo de aprovação)
        if (!medico.ativo) {
            return res.status(401).json({ mensagem: 'Sua conta ainda não foi ativada pela administração.' });
        }

        // 3. Comparar a senha (hash)
        const senhaValida = await bcrypt.compare(senha, medico.senha_hash);

        if (!senhaValida) {
            return res.status(401).json({ mensagem: 'Email ou senha inválidos.' });
        }

        // 4. Gerar o Token JWT
        const token = jwt.sign(
            { id: medico.id, crm: medico.crm, email: medico.email }, 
            jwtConfig.secret, // Chave secreta
            { expiresIn: jwtConfig.expiresIn } // Tempo de expiração
        );

        // 5. Retornar token e dados do usuário
        return res.status(200).json({ 
            medico: { id: medico.id, nome: medico.nome, crm: medico.crm },
            token: token
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao fazer login.' });
    }
}

module.exports = { cadastrarMedico, loginMedico };