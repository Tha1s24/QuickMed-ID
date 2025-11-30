module.exports = {
    // A chave secreta deve ser longa, complexa e mantida em variáveis de ambiente.
    // Use uma ferramenta para gerar uma string aleatória forte.
    secret: process.env.APP_SECRET || "minha_chave_super_secreta_quickmed_id_12345",
    
    // Tempo de expiração do token de sessão.
    // 7 dias é um tempo comum para aplicações web.
    expiresIn: '7d', 
};