// backend/tests/integracao.test.js - (Trecho de DADOS FICTÍCIOS)

const MEDICO_MFA_USER = {
    crm: "12345CRM",
    estado_crm: "SP",
    // NOVO CAMPO PARA LOGIN/TESTE
    email: "medico.teste@quickmed.com", 
    senha: "senhaSegura123" 
};

// ... restante das variáveis ...

// =================================================================
// GRUPO DE TESTES: FLUXO DO MÉDICO
// =================================================================
describe('Fluxo do Médico: Login, MFA e Emissão de Documento', () => {

    // 1. REGISTRO
    test('1. Deve registrar o médico e validar o CRM', async () => {
        // O payload agora inclui o email
        const res = await request(app)
            .post('/api/auth/register')
            .send(MEDICO_MFA_USER); 

        expect(res.statusCode).toBe(201);
    });

    // 3. LOGIN COM MFA ATIVADO
    test('3. Deve exigir MFA após o login padrão', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            // Agora usa email e senha
            .send({ email: MEDICO_MFA_USER.email, senha: MEDICO_MFA_USER.senha }); 

        expect(res.statusCode).toBe(202); 
        expect(res.body.mfa_required).toBe(true);
        mfaTokenTemp = res.body.token_mfa_temp;
    });

    // ... restante dos testes permanecem os mesmos, usando o token gerado ...
});