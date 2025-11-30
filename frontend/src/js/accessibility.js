// src/js/accessibility.js

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // =========================================================
    // 1. GERENCIAMENTO DE TAMANHO DE FONTE
    // =========================================================
    const FONT_CLASSES = ['font-normal', 'font-medium', 'font-large'];
    const MAX_SIZE_INDEX = FONT_CLASSES.length - 1;

    /**
     * Recupera o índice atual da classe de tamanho de fonte salva no localStorage.
     * @returns {number} O índice na array FONT_CLASSES.
     */
    function getCurrentFontSizeIndex() {
        // Pega a classe salva ou assume a 'font-normal' (índice 0)
        const currentClass = localStorage.getItem('font-size') || FONT_CLASSES[0];
        return FONT_CLASSES.indexOf(currentClass);
    }

    /**
     * Aplica a nova classe de tamanho de fonte no body e salva no localStorage.
     * @param {number} newIndex - O índice da nova classe de fonte a ser aplicada.
     */
    function updateFontSize(newIndex) {
        if (newIndex >= 0 && newIndex <= MAX_SIZE_INDEX) {
            // Remove classes antigas para garantir que apenas uma esteja ativa
            FONT_CLASSES.forEach(c => body.classList.remove(c));

            const newClass = FONT_CLASSES[newIndex];
            body.classList.add(newClass);
            localStorage.setItem('font-size', newClass);
        }
    }

    // Inicializa a fonte na carga da página
    updateFontSize(getCurrentFontSizeIndex());

    // Listeners para aumento/diminuição
    const btnIncrease = document.getElementById('btn-increase-font');
    const btnDecrease = document.getElementById('btn-decrease-font');

    if (btnIncrease) {
        btnIncrease.addEventListener('click', () => {
            let currentIndex = getCurrentFontSizeIndex();
            updateFontSize(currentIndex + 1);
        });
    }

    if (btnDecrease) {
        btnDecrease.addEventListener('click', () => {
            let currentIndex = getCurrentFontSizeIndex();
            updateFontSize(currentIndex - 1);
        });
    }

    // =========================================================
    // 2. GERENCIAMENTO DE TEMAS (ESCURO E CONTRASTE)
    // =========================================================

    /**
     * Alterna a classe de tema no body, garantindo que apenas um tema especial esteja ativo.
     * @param {string} themeClass - Classe do tema a ser alternado (ex: 'dark-mode').
     * @param {string} storageKey - Chave do localStorage.
     */
    function toggleTheme(themeClass, storageKey) {
        const otherThemeClass = (themeClass === 'dark-mode') ? 'contrast-mode' : 'dark-mode';
        const otherStorageKey = (themeClass === 'dark-mode') ? 'contrast-mode' : 'dark-mode';

        if (body.classList.contains(themeClass)) {
            // Desativa o tema
            body.classList.remove(themeClass);
            localStorage.removeItem(storageKey);
        } else {
            // Ativa o novo tema
            body.classList.add(themeClass);
            localStorage.setItem(storageKey, 'true');

            // Desativa o outro tema para evitar conflito de estilos
            if (body.classList.contains(otherThemeClass)) {
                body.classList.remove(otherThemeClass);
                localStorage.removeItem(otherStorageKey);
            }
        }
    }

    // Inicializa temas na carga (recupera estado)
    if (localStorage.getItem('dark-mode')) {
        body.classList.add('dark-mode');
    }
    if (localStorage.getItem('contrast-mode')) {
        body.classList.add('contrast-mode');
    }

    // Listeners para temas
    const btnDark = document.getElementById('btn-toggle-dark');
    const btnContrast = document.getElementById('btn-toggle-contrast');

    if (btnDark) {
        btnDark.addEventListener('click', () => {
            toggleTheme('dark-mode', 'dark-mode');
        });
    }

    if (btnContrast) {
        btnContrast.addEventListener('click', () => {
            toggleTheme('contrast-mode', 'contrast-mode');
        });
    }

    // =========================================================
    // 3. LIBRAS
    // * Não é necessário código JS aqui.
    // * O widget VLibras é carregado via CDN no HTML e inicializa automaticamente.
    // =========================================================

});