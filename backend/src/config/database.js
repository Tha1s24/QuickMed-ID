// Acessa as variáveis de ambiente para segurança (process.env)
module.exports = {
    // Tipo de banco de dados
    dialect: 'postgres', // Ou 'mysql', 'mariadb', 'sqlite', dependendo da sua escolha
    
    // Configurações de conexão
    host: process.env.DB_HOST || 'localhost',
    username: process.env.DB_USER || 'quickmed_user',
    password: process.env.DB_PASSWORD || 'sua_senha_segura',
    database: process.env.DB_NAME || 'quickmed_id_db',
    port: process.env.DB_PORT || 5432, // Porta padrão do Postgres

    // Configurações extras
    define: {
        timestamps: true,        // Habilita created_at e updated_at
        underscored: true,       // Usa snake_case (nome_do_campo) no BD
        underscoredAll: true,
    },
    
    // Configurações de pool de conexões
    pool: {
        max: 5,                  // Máximo de conexões no pool
        min: 0,                  // Mínimo de conexões no pool
        acquire: 30000,          // Tempo máximo de espera para adquirir uma conexão (ms)
        idle: 10000              // Tempo máximo de inatividade antes de liberar a conexão (ms)
    }
};