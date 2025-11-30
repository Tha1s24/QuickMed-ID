// frontend/src/js/validation.js

import { validarCarteirinha } from './api.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const validationForm = document.getElementById('validationForm');
    const resultDiv = document.getElementById('validationResult');
    
    if (validationForm) {
        validationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const codigo = document.getElementById('codigo').value.toUpperCase().trim();
            
            // Limpa e mostra o spinner de carregamento
            resultDiv.classList.remove('hidden', 'valid', 'invalid');
            resultDiv.innerHTML = '<p><i class="fas fa-spinner fa-spin"></i> Verificando...</p>';

            try {
                const resultado = await validarCarteirinha(codigo);

                // Remove o spinner
                resultDiv.innerHTML = ''; 

                if (resultado.valido) {
                    resultDiv.classList.add('valid');
                    resultDiv.innerHTML = `
                        <h3><i class="fas fa-check-circle"></i> Documento Ativo!</h3>
                        <p><strong>Paciente:</strong> ${resultado.paciente}</p>
                        <p><strong>Motivo de Prioridade:</strong> ${resultado.motivo}</p>
                        <p><strong>Válido Até:</strong> ${new Date(resultado.validade).toLocaleDateString()}</p>
                    `;
                } else {
                    resultDiv.classList.add('invalid');
                    resultDiv.innerHTML = `
                        <h3><i class="fas fa-times-circle"></i> Inválido ou Expirado</h3>
                        <p><strong>Mensagem:</strong> ${resultado.mensagem}</p>
                        <p>O documento deve ser renovado pelo médico emissor.</p>
                    `;
                }
            } catch (error) {
                resultDiv.classList.add('invalid');
                resultDiv.innerHTML = `
                    <h3><i class="fas fa-exclamation-triangle"></i> Erro de Comunicação</h3>
                    <p>Não foi possível acessar a base de dados. Tente novamente.</p>
                `;
            }
        });
    }
});