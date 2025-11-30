// Importa a biblioteca 'uuid' para gerar códigos universais e únicos (UUID v4)
// Você precisará instalar esta dependência: npm install uuid
const { v4: uuidv4 } = require('uuid'); 

// Importa a configuração de ambiente (onde você definiria a URL base do seu app)
const config = require('../config/config'); 

// --- FUNÇÃO 1: Gerar Código Único de Validação ---
/**
 * Gera um código UUID (Universally Unique Identifier) para ser usado
 * como o codigo_validacao na tabela CARTEIRINHAS e no QR Code.
 * @returns {string} Um código único no formato UUID v4.
 */
function generateUniqueCode() {
    // Retorna um UUID (ex: 'a1b2c3d4-e5f6-7890-a1b2-c3d4e5f6a1b2')
    return uuidv4(); 
}

// --- FUNÇÃO 2: Gerar URL de Validação para o QR Code ---
/**
 * Constrói a URL completa que será codificada no QR Code do documento.
 * O QR Code direcionará o fiscal para esta URL pública.
 * @param {string} code - O código único de validação gerado.
 * @returns {string} A URL completa de validação.
 */
function generateValidationUrl(code) {
    // Usa a URL base do Front-end ou da API de validação
    // Exemplo: 'https://quickmedid.com/validar/a1b2c3d4-...'
    const baseUrl = config.app.validationUrl || 'http://localhost:3000/validar';
    
    return `${baseUrl}/${code}`;
}

// --- FUNÇÃO 3: Estrutura completa do Objeto QR Code ---
/**
 * Combina as funções e retorna o código e a URL prontos para uso.
 * @returns {object} Um objeto contendo o código e a URL.
 */
function generateQRCodeData() {
    const uniqueCode = generateUniqueCode();
    const validationUrl = generateValidationUrl(uniqueCode);

    return {
        codigo_validacao: uniqueCode, // Campo que vai para o banco de dados
        url_qr_code: validationUrl    // URL que será usada pelo gerador de imagem QR Code (Front-end ou serviço externo)
    };
}

module.exports = { 
    generateUniqueCode, 
    generateValidationUrl,
    generateQRCodeData 
};