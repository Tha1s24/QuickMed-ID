// frontend/src/js/auth.js

import { loginMedico, cadastrarMedico } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================
    // Lógica de Login
    // =========================================================
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            
            try {
                const response = await loginMedico(email, senha);
                
                // Armazena o token e redireciona
                localStorage.setItem('quickmed_token', response.token);
                alert(`Login realizado com sucesso, Dr(a). ${response.medico.nome}!`);
                window.location.href = 'dashboard.html';

            } catch (error) {
                alert(error.message || 'Erro de conexão ou credenciais inválidas.');
                console.error("Erro de Login:", error);
            }
        });
    }

    // =========================================================
    // Lógica de Cadastro
    // =========================================================
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const dados = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                senha: document.getElementById('senha').value,
                crm: document.getElementById('crm').value,
                cpf: document.getElementById('cpf').value,
                especialidade: document.getElementById('especialidade').value,
            };

            try {
                const response = await cadastrarMedico(dados);
                alert(response.message);
                
                // Redireciona para o login após o cadastro
                window.location.href = 'login.html'; 

            } catch (error) {
                alert(error.message || 'Erro ao tentar cadastrar. Tente novamente.');
                console.error("Erro de Cadastro:", error);
            }
        });
    }
});