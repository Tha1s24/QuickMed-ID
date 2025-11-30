// frontend/src/js/dashboard.js

import { getHistorico, emitirCarteirinha, getMedicoInfo } from './api.js'; 

// Dados armazenados globalmente para facilitar a filtragem
let pacientesHistoricoData = [];


// =========================================================
// FUNÇÕES DE FILTRAGEM E NOTIFICAÇÃO
// =========================================================

function aplicarFiltros() {
    const statusFiltro = document.getElementById('filtroStatus').value;
    const buscaTexto = document.getElementById('buscaPaciente').value.toLowerCase();
    const historicoCorpo = document.getElementById('historicoCorpo');
    historicoCorpo.innerHTML = ''; 

    const dadosFiltrados = pacientesHistoricoData.filter(paciente => {
        const isAtiva = new Date(paciente.data_validade) >= new Date();
        const status = isAtiva ? 'ativa' : 'expirado';
        
        // 1. Filtro por Status
        const statusMatch = statusFiltro === 'todos' || statusFiltro === status;

        // 2. Filtro por Busca (Nome ou CPF)
        const buscaMatch = 
            paciente.nome_paciente.toLowerCase().includes(buscaTexto) ||
            paciente.cpf_paciente.includes(buscaTexto);

        return statusMatch && buscaMatch;
    });

    if (dadosFiltrados.length > 0) {
        dadosFiltrados.forEach(paciente => {
            const isAtiva = new Date(paciente.data_validade) >= new Date();
            const status = isAtiva ? 'ATIVA' : 'EXPIRADO';
            const statusClass = isAtiva ? 'status-ativo' : 'status-expirado';
            const row = historicoCorpo.insertRow();
            
            row.innerHTML = `
                <td>${paciente.nome_paciente}</td>
                <td>${paciente.motivo}</td>
                <td>${new Date(paciente.data_validade).toLocaleDateString('pt-BR')}</td>
                <td class="${statusClass}">${status}</td>
                <td>
                    <button type="button" class="btn btn-secondary btn-small status-atualizar" 
                        data-id="${paciente.id}" 
                        data-nome="${paciente.nome_paciente}" 
                        data-cpf="${paciente.cpf_paciente}"
                        title="Renovar validade para ${paciente.nome_paciente}">
                        Atualizar
                    </button>
                </td>
            `;
        });
    } else {
        historicoCorpo.innerHTML = '<tr><td colspan="5" class="loading-message">Nenhum registro encontrado com os filtros aplicados.</td></tr>';
    }
}


function checkAndDisplayNotifications() {
    const notificationBox = document.getElementById('validade-notificacao');
    const hoje = new Date();
    const avisoCurto = new Date();
    avisoCurto.setDate(hoje.getDate() + 7); 

    let notificacoes = [];

    pacientesHistoricoData.forEach(paciente => {
        const validade = new Date(paciente.data_validade);
        
        if (validade < hoje) {
            notificacoes.push(`O documento de **${paciente.nome_paciente}** expirou em ${validade.toLocaleDateString('pt-BR')}.`);
        } else if (validade <= avisoCurto) {
            notificacoes.push(`O documento de **${paciente.nome_paciente}** expira em breve, ${validade.toLocaleDateString('pt-BR')} (próximos 7 dias).`);
        }
    });

    // Limpa classes anteriores e oculta por padrão
    notificationBox.classList.remove('notification-error', 'notification-warning');
    notificationBox.classList.add('hidden');

    if (notificacoes.length > 0) {
        notificationBox.classList.remove('hidden');
        notificationBox.classList.add(notificacoes.some(n => n.includes('expirou')) ? 'notification-error' : 'notification-warning');

        // Cria o HTML da notificação
        notificationBox.innerHTML = `
            <h4><i class="fas fa-exclamation-triangle"></i> Atenção: Validades Próximas ou Expiradas (${notificacoes.length})</h4>
            <ul>
                ${notificacoes.map(msg => `<li>${msg}</li>`).join('')}
            </ul>
        `;
    }
}


async function renderHistorico() {
    const historicoCorpo = document.getElementById('historicoCorpo');
    historicoCorpo.innerHTML = '<tr><td colspan="5" class="loading-message">Carregando histórico...</td></tr>';

    try {
        const data = await getHistorico(); 
        pacientesHistoricoData = data; 

        aplicarFiltros(); 
        checkAndDisplayNotifications();

    } catch (error) {
        historicoCorpo.innerHTML = '<tr><td colspan="5" class="loading-message status-expirado">Erro ao carregar histórico.</td></tr>';
    }
}


// =========================================================
// LÓGICA PRINCIPAL (DOMContentLoaded)
// =========================================================
document.addEventListener('DOMContentLoaded', async () => {
    
    const token = localStorage.getItem('quickmed_token');
    const medicoNomeElement = document.getElementById('medicoNome');
    const formEmissaoPaciente = document.getElementById('formEmissaoPaciente');
    const resultadoEmissaoSection = document.getElementById('resultadoEmissao');

    // 1. Verificação de Autenticação
    if (!token) {
        window.location.href = 'login.html'; 
        return;
    }
    try {
        const medico = await getMedicoInfo(); 
        medicoNomeElement.textContent = `Olá, Dr(a). ${medico.nome}`;
    } catch (error) {
        localStorage.removeItem('quickmed_token');
        window.location.href = 'login.html';
        return;
    }


    // 2. Lógica de Logout (CORRETO)
    const btnLogout = document.getElementById('btnLogout'); 
    if (btnLogout) { 
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault(); 
            localStorage.removeItem('quickmed_token');
            window.location.href = 'index.html'; 
        });
    }

    // 3. Lógica de Emissão e Geração de QR Code
    formEmissaoPaciente.addEventListener('submit', async (e) => {
        e.preventDefault();

        const form = e.target;
        const dataValidadeInput = form.dataValidade;

        if (new Date(dataValidadeInput.value) < new Date()) {
            alert("A data limite de validade deve ser futura.");
            dataValidadeInput.focus();
            return;
        }

        const dadosEmissao = {
            nome_paciente: form.pacienteNome.value,
            cpf_paciente: form.pacienteCPF.value,
            motivo: form.motivo.value,
            data_validade: form.dataValidade.value, 
        };

        try {
            const btnSubmit = form.querySelector('button[type="submit"]');
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Emitindo... Aguarde';

            const resultado = await emitirCarteirinha(dadosEmissao);
            
            // --- Geração e Exibição do QR Code ---
            const qrCodeContainer = document.getElementById('qrCodeContainer');
            const codigoValidacao = resultado.codigo_validacao;

            qrCodeContainer.innerHTML = `
                <p>Código: <strong>${codigoValidacao}</strong></p>
                <div id="qrcodeDisplay" class="mb-3"></div> 
                <a href="src/pages/validation.html?code=${codigoValidacao}" target="_blank">Ver Carteirinha (Link Público)</a>
            `;
            
            const baseUrl = window.location.origin;
            const linkCompleto = `${baseUrl}/src/pages/validation.html?code=${codigoValidacao}`;

            // Usa a variável global 'QRCode' do CDN
            if (typeof QRCode !== 'undefined') {
                new QRCode(document.getElementById("qrcodeDisplay"), {
                    text: linkCompleto, 
                    width: 128,
                    height: 128,
                    colorDark : "#1a2b4b",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                });
            }
            // ------------------------------------
            
            resultadoEmissaoSection.classList.remove('hidden');
            resultadoEmissaoSection.scrollIntoView({ behavior: 'smooth' });

            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '<i class="fas fa-paper-plane"></i> Emitir QuickMed ID';
            form.reset();
            renderHistorico(); 

        } catch (error) {
            alert(error.message || 'Falha na emissão. Verifique os dados e tente novamente.');
            form.querySelector('button[type="submit"]').disabled = false;
            form.querySelector('button[type="submit"]').innerHTML = '<i class="fas fa-paper-plane"></i> Emitir QuickMed ID';
        }
    });


    // 4. Lógica de Atualização (Pré-preenchimento)
    document.getElementById('historicoCorpo').addEventListener('click', (e) => {
        if (e.target.classList.contains('status-atualizar')) {
            const btn = e.target;
            
            document.getElementById('pacienteNome').value = btn.getAttribute('data-nome');
            document.getElementById('pacienteCPF').value = btn.getAttribute('data-cpf');
            
            document.getElementById('emissao-paciente').scrollIntoView({ behavior: 'smooth' });
            
            document.getElementById('dataValidade').value = ''; 

            resultadoEmissaoSection.classList.add('hidden');
            alert(`Dados de ${btn.getAttribute('data-nome')} carregados para renovação. Selecione o motivo e defina a **nova Data Limite de Validade**.`);
        }
    });
    
    // 5. Adiciona Listeners para os Filtros
    document.getElementById('filtroStatus').addEventListener('change', aplicarFiltros);
    document.getElementById('buscaPaciente').addEventListener('keyup', aplicarFiltros);

    // Inicia o carregamento
    renderHistorico();
});