// backend/database/index.js

const Sequelize = require('sequelize');
const dbConfig = require('../src/config/database');

// Importação dos Modelos (Ajustados para o padrão de exportação do Sequelize)
const Medico = require('../src/models/Medico');
const Carteirinha = require('../src/models/Carteirinha'); 

// Array de Modelos para facilitar a inicialização
const models = [Medico, Carteirinha];

// Cria a conexão com o banco de dados
const connection = new Sequelize(dbConfig);

// Inicializa e Associa os Modelos
models.forEach(model => model.init(connection));

// Executa a associação (relacionamentos) se o método 'associate' existir no modelo
models.forEach(model => {
    if (model.associate) {
        model.associate(connection.models);
    }
});

// Testa a conexão
try {
    connection.authenticate();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
} catch (error) {
    console.error('❌ Falha ao conectar com o banco de dados:', error);
}

module.exports = connection;