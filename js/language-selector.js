// Language Selector Component

class LanguageSelector {
    constructor() {
        this.languages = {
            'ar': { name: 'العربية', native: 'العربية' },
            'de': { name: 'German', native: 'Deutsch' },
            'en': { name: 'English', native: 'English' },
            'es': { name: 'Spanish', native: 'Español' },
            'fil': { name: 'Filipino', native: 'Filipino' },
            'fr': { name: 'French', native: 'Français' },
            'hi': { name: 'Hindi', native: 'हिन्दी' },
            'id': { name: 'Indonesian', native: 'Bahasa Indonesia' },
            'it': { name: 'Italian', native: 'Italiano' },
            'ja': { name: 'Japanese', native: '日本語' },
            'ko': { name: 'Korean', native: '한국어' },
            'ms': { name: 'Malay', native: 'Bahasa Melayu' },
            'nl': { name: 'Dutch', native: 'Nederlands' },
            'pt_PT': { name: 'Portuguese (Portugal)', native: 'Português (Portugal)' },
            'pt_BR': { name: 'Portuguese (Brazil)', native: 'Português (Brasil)' },
            'ru': { name: 'Russian', native: 'Русский' },
            'sv': { name: 'Swedish', native: 'Svenska' },
            'th': { name: 'Thai', native: 'ไทย' },
            'tr': { name: 'Turkish', native: 'Türkçe' },
            'uk': { name: 'Ukrainian', native: 'Українська' },
            'vi': { name: 'Vietnamese', native: 'Tiếng Việt' },
            'zh_CN': { name: 'Chinese (Simplified)', native: '中文 (简体)' },
            'zh_TW': { name: 'Chinese (Traditional, Taiwan)', native: '中文 (繁體，台灣)' },
            'zh_HK': { name: 'Chinese (Traditional, Hong Kong)', native: '中文 (繁體，香港)' }
        };
    }

    createSelector() {
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = `
            <button class="language-button" aria-label="Select Language" aria-haspopup="true" aria-expanded="false">
                <span class="language-icon">🌐</span>
                <span class="language-current">${this.languages[i18n.currentLang]?.native || 'English'}</span>
                <span class="language-arrow">▼</span>
            </button>
            <div class="language-dropdown">
                ${Object.entries(this.languages).map(([code, lang]) => `
                    <button class="language-option ${code === i18n.currentLang ? 'active' : ''}" 
                            data-lang="${code}" 
                            aria-label="Switch to ${lang.name}">
                        <span class="language-native">${lang.native}</span>
                        <span class="language-name">${lang.name}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // Add event listeners
        const button = selector.querySelector('.language-button');
        const dropdown = selector.querySelector('.language-dropdown');
        const options = selector.querySelectorAll('.language-option');

        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.toggle('open');
            button.setAttribute('aria-expanded', isOpen);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                dropdown.classList.remove('open');
                button.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle language selection
        options.forEach(option => {
            option.addEventListener('click', async (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                if (lang !== i18n.currentLang) {
                    await i18n.setLanguage(lang);
                    this.updateSelector(selector);
                }
                dropdown.classList.remove('open');
                button.setAttribute('aria-expanded', 'false');
            });
        });

        return selector;
    }

    updateSelector(selector) {
        const currentSpan = selector.querySelector('.language-current');
        const currentLang = this.languages[i18n.currentLang];
        if (currentSpan && currentLang) {
            currentSpan.textContent = currentLang.native;
        }

        // Update active state
        selector.querySelectorAll('.language-option').forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === i18n.currentLang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    init() {
        // Wait for i18n to be ready
        if (window.i18n && window.i18n.loaded) {
            this.insertSelector();
        } else {
            window.addEventListener('languageChanged', () => {
                const selector = document.querySelector('.language-selector');
                if (selector) {
                    this.updateSelector(selector);
                }
            });
            // Try again after a short delay
            setTimeout(() => {
                if (window.i18n) {
                    this.insertSelector();
                }
            }, 100);
        }
    }

    insertSelector() {
        // Find navigation container
        const navContainer = document.querySelector('.navbar .container');
        if (navContainer) {
            // Check if selector already exists
            if (!document.querySelector('.language-selector')) {
                const selector = this.createSelector();
                navContainer.appendChild(selector);
            }
        }
    }
}

// Initialize language selector when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const selector = new LanguageSelector();
        selector.init();
    });
} else {
    const selector = new LanguageSelector();
    selector.init();
}

