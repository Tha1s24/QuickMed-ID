// frontend/src/js/visitor.js

document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================================
    // 1. Lógica de Navegação (Botões de Autenticação)
    // =========================================================
    const btnLogin = document.getElementById('btnLogin');
    const btnCadastro = document.getElementById('btnCadastro');

    if (btnLogin) {
        btnLogin.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
    if (btnCadastro) {
        btnCadastro.addEventListener('click', () => {
            window.location.href = 'register.html';
        });
    }

    // =========================================================
    // 2. Lógica do Acordeão (FAQ) - CORREÇÃO FUNCIONAL
    // =========================================================
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const is_active = item.classList.contains('active');

            // Itera e fecha todos os outros itens ativos para que apenas um fique aberto por vez
            document.querySelectorAll('.accordion-item.active').forEach(active_item => {
                if (active_item !== item) {
                    active_item.classList.remove('active');
                    // Usa style.maxHeight = "0" para a animação de fechar
                    active_item.querySelector('.accordion-content').style.maxHeight = "0";
                }
            });

            // Abre ou fecha o item clicado
            if (is_active) {
                item.classList.remove('active');
                content.style.maxHeight = "0";
            } else {
                item.classList.add('active');
                // Usa content.scrollHeight para definir a altura exata e animar a abertura
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});