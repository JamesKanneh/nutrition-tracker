// theme.js - Shared theme toggle for NutriTrack

function initTheme() {
    const saved = localStorage.getItem('nutritrack-theme') || 'dark';
    applyTheme(saved);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nutritrack-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.innerHTML = theme === 'dark'
            ? '<span class="theme-icon">☀️</span> Light Mode'
            : '<span class="theme-icon">🌙</span> Dark Mode';
    }
}

function toggleTheme() {
    const current = localStorage.getItem('nutritrack-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Run on page load
initTheme();
