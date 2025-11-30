-- Tabela de Médicos
CREATE TABLE medicos (
    id UUID PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    crm VARCHAR(20) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    data_cadastro TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ativo BOOLEAN DEFAULT TRUE
);

-- Tabela de Carteirinhas
CREATE TABLE carteirinhas (
    id UUID PRIMARY KEY,
    id_medico UUID NOT NULL,
    nome_paciente VARCHAR(255) NOT NULL,
    cpf_paciente VARCHAR(14) NOT NULL,
    motivo TEXT NOT NULL,
    data_emissao DATE NOT NULL,
    data_validade DATE NOT NULL,
    codigo_validacao VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(10) NOT NULL,
    
    -- Definição da Chave Estrangeira
    CONSTRAINT fk_medico
        FOREIGN KEY(id_medico) 
        REFERENCES medicos(id)
        ON DELETE RESTRICT
);