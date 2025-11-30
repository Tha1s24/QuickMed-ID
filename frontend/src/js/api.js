// frontend/src/js/api.js

const API_BASE_URL = 'http://localhost:3000/api/v1'; // URL da sua API Node/Python

// =========================================================
// Mocks (Dados de Teste)
// =========================================================
const MEDICO_INFO_MOCK = { nome: "Ana Carolina Teixeira", crm: "54321-ES" };
const HISTORICO_MOCK = [
    {
        id: 'QM1001', nome_paciente: 'João da Silva', cpf_paciente: '111.111.111-11',
        motivo: 'Pós-Cirurgia Ortopédica', data_emissao: '2025-11-10',
        data_validade: '2026-02-10', status: 'ATIVA', codigo_validacao: 'XYZ789'
    },
    {
        id: 'QM1002', nome_paciente: 'Maria Souza', cpf_paciente: '222.222.222-22',
        motivo: 'Quimioterapia Ativa', data_emissao: '2025-08-01',
        data_validade: '2025-11-01', status: 'EXPIRADO', codigo_validacao: 'ABC123'
    }
];

// =========================================================
// Funções da API
// =========================================================

/**
 * Simula o login do médico e retorna um token.
 */
export async function loginMedico(email, senha) {
    console.log(`Tentativa de Login para: ${email}`);
    // No MVP, se a senha for '123456', simulamos sucesso.
    if (senha === '123456') {
        // Simula o token JWT recebido do servidor
        return { token: 'mock-jwt-token-54321', medico: MEDICO_INFO_MOCK };
    } else {
        throw new Error("Credenciais inválidas ou médico não aprovado.");
    }
}

/**
 * Simula o cadastro do médico.
 */
export async function cadastrarMedico(dados) {
    console.log("Dados de Cadastro enviados:", dados);
    // Simula a resposta do servidor informando que o cadastro está pendente de aprovação
    return { success: true, message: "Cadastro enviado! Aguarde a aprovação do seu CRM." };
}

/**
 * Busca as informações do médico logado.
 */
export async function getMedicoInfo() {
    // Em um cenário real, usaria o token para buscar os dados.
    return MEDICO_INFO_MOCK;
}

/**
 * Simula a emissão de uma nova carteirinha.
 */
export async function emitirCarteirinha(dados) {
    console.log("Dados de Emissão enviados:", dados);
    // Simula a criação do documento e a geração de um código
    const novoCodigo = 'QM' + Math.floor(Math.random() * 9000 + 1000);
    return { 
        success: true, 
        codigo_validacao: novoCodigo,
        data_emissao: new Date().toISOString().split('T')[0]
    };
}

/**
 * Busca o histórico de emissões do médico.
 */
export async function getHistorico() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(HISTORICO_MOCK);
        }, 500); // Simula um pequeno atraso de rede
    });
}

/**
 * Simula a validação de um código de carteirinha pública.
 */
export async function validarCarteirinha(codigo) {
    // Simula validação (Apenas o código 'XYZ789' é ativo)
    const documento = HISTORICO_MOCK.find(d => d.codigo_validacao === codigo);

    if (documento && documento.status === 'ATIVA') {
        return { 
            valido: true,
            paciente: documento.nome_paciente,
            motivo: documento.motivo,
            validade: documento.data_validade
        };
    } else if (documento && documento.status === 'EXPIRADO') {
        return { valido: false, mensagem: "Documento Expirado em " + documento.data_validade };
    } else {
        return { valido: false, mensagem: "Código de validação não encontrado." };
    }
}