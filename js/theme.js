// Theme handling: localStorage > system preference > light default
(function () {
    'use strict';

    var STORAGE_KEY = 'theme';

    function getStoredTheme() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function systemPrefersDark() {
        return window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function resolveTheme() {
        var stored = getStoredTheme();
        if (stored === 'light' || stored === 'dark') return stored;
        return systemPrefersDark() ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateToggleButton(theme);
        // App Store badge color follows the theme (black on light, white on dark)
        if (window.GoGBAI18n && window.GoGBAI18n.updateBadges) {
            window.GoGBAI18n.updateBadges();
        }
    }

    function updateToggleButton(theme) {
        var btn = document.querySelector('.theme-toggle');
        if (!btn) return;
        var isDark = theme === 'dark';
        // show the icon of the target you'll switch TO
        btn.textContent = isDark ? '\u2600\uFE0F' : '\uD83C\uDF19'; // sun / moon
        btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    function toggleTheme() {
        var current = document.documentElement.getAttribute('data-theme') || resolveTheme();
        var next = current === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
        applyTheme(next);
    }

    function initTheme() {
        applyTheme(resolveTheme());
        var toggleBtn = document.querySelector('.theme-toggle');
        if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);
        // follow system changes in real time only when user hasn't manually chosen
        if (window.matchMedia) {
            var mq = window.matchMedia('(prefers-color-scheme: dark)');
            var onChange = function () {
                if (!getStoredTheme()) applyTheme(systemPrefersDark() ? 'dark' : 'light');
            };
            if (mq.addEventListener) mq.addEventListener('change', onChange);
            else if (mq.addListener) mq.addListener(onChange);
        }
    }

    window.GoGBATheme = { init: initTheme, toggle: toggleTheme };
})();
