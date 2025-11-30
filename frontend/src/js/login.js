// frontend/src/js/login.js - CORREÇÃO COMPLETA

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    // Usando 127.0.0.1 é mais estável que localhost em alguns ambientes
    const BACKEND_URL = 'http://127.0.0.1:3000/api/auth/login'; 

    if (loginForm) {
        // CORREÇÃO CRÍTICA: Adicionar 'async' aqui para validar o 'await'
        loginForm.addEventListener('submit', async (event) => { 
            
            event.preventDefault(); 
            
            const emailInput = document.getElementById('email'); 
            const senhaInput = document.getElementById('senha'); 

            if (!emailInput || !senhaInput) {
                console.error("Erro: Um ou mais campos (email/senha) não têm o ID correto no HTML.");
                return;
            }

            const email = emailInput.value.trim();
            const senha = senhaInput.value;
            const payload = { email, senha };

            try {
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify(payload)
                });

                // Verifica se a resposta foi de sucesso (200, 202, etc.)
                if (response.ok || response.status === 202) {
                    const data = await response.json(); 
                    handleLoginSuccess(data);
                } 
                else {
                    // Trata erros como 401 (Não Autorizado) ou 405 (Método não permitido)
                    let errorMessage = 'Erro desconhecido na autenticação.';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch (e) {
                        // Se o corpo não for JSON (ex: 405), usa mensagem padrão
                        console.error("Resposta de erro não é JSON:", response.status, e);
                        errorMessage = `Falha na requisição. Status: ${response.status}. Verifique as rotas do Backend.`;
                    }
                    
                    alert(`Falha no Login: ${errorMessage}`);
                    console.error('Erro de Autenticação:', errorMessage);
                }

            } catch (error) {
                console.error('Erro de conexão com o servidor:', error);
                alert('Não foi possível conectar ao servidor. Verifique se o Backend está ativo.');
            }
        });
    } else {
        console.error('Erro: Formulário de login (id="login-form") não encontrado no login.html.');
    }
});

function handleLoginSuccess(data) {
    if (data.mfa_required) {
        if (data.token_mfa_temp) {
            localStorage.setItem('mfa_temp_token', data.token_mfa_temp);
        }
        alert("Autenticação de Múltiplos Fatores (MFA) necessária. Por favor, insira seu código.");
    } else if (data.token) {
        localStorage.setItem('auth_token', data.token);
        alert("Login bem-sucedido! Acessando Dashboard.");
        window.location.href = 'dashboard.html';
    } else {
         alert("Resposta de login incompleta. Tente novamente.");
    }
}