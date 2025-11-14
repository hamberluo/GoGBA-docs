// Internationalization (i18n) System for GoGBA Documentation

class I18n {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.translations = {};
        this.loaded = false;
    }

    // Detect user's preferred language
    detectLanguage() {
        // Check localStorage first
        const saved = localStorage.getItem('gogba-lang');
        if (saved) return saved;

        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        // Map browser language to supported languages
        const langMap = {
            'ar': 'ar', 'de': 'de', 'en': 'en', 'es': 'es', 'fil': 'fil',
            'fr': 'fr', 'hi': 'hi', 'id': 'id', 'it': 'it', 'ja': 'ja',
            'ko': 'ko', 'ms': 'ms', 'nl': 'nl', 'pt': 'pt_BR', 'ru': 'ru',
            'sv': 'sv', 'th': 'th', 'tr': 'tr', 'uk': 'uk', 'vi': 'vi',
            'zh': 'zh_CN'
        };

        // Check for Chinese variants
        if (browserLang.includes('zh')) {
            if (browserLang.includes('TW') || browserLang.includes('HK')) {
                return browserLang.includes('HK') ? 'zh_HK' : 'zh_TW';
            }
            return 'zh_CN';
        }

        // Check for Portuguese variants
        if (browserLang.includes('pt')) {
            return browserLang.includes('BR') ? 'pt_BR' : 'pt_PT';
        }

        return langMap[langCode] || 'en';
    }

    // Load translation file
    async loadLanguage(lang) {
        if (this.translations[lang]) {
            return Promise.resolve();
        }

        try {
            const response = await fetch(`i18n/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language: ${lang}`);
            }
            this.translations[lang] = await response.json();
        } catch (error) {
            console.warn(`Failed to load language ${lang}, falling back to English`, error);
            // Fallback to English if language file doesn't exist
            if (lang !== 'en') {
                await this.loadLanguage('en');
            }
        }
    }

    // Get translation by key path (e.g., "nav.home")
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];

        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                // Fallback to English if key not found
                if (this.currentLang !== 'en' && this.translations['en']) {
                    value = this.translations['en'];
                    for (const k2 of keys) {
                        value = value ? value[k2] : undefined;
                    }
                }
                break;
            }
        }

        if (typeof value !== 'string') {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }

        // Replace parameters
        return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
            return params[param] !== undefined ? params[param] : match;
        });
    }

    // Change language
    async setLanguage(lang) {
        await this.loadLanguage(lang);
        this.currentLang = lang;
        localStorage.setItem('gogba-lang', lang);
        this.updatePage();
    }

    // Update all translatable elements on the page
    updatePage() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;

        // Update dir attribute for RTL languages
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        const langCode = this.currentLang.split('_')[0];
        if (rtlLanguages.includes(langCode)) {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else if (element.hasAttribute('data-i18n-html')) {
                element.innerHTML = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update title
        const page = this.getCurrentPage();
        if (page && this.t(`${page}.title`)) {
            document.title = this.t(`${page}.title`);
        }

        // Update meta description if exists
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && page && this.t(`${page}.description`)) {
            metaDesc.content = this.t(`${page}.description`);
        }

        // Trigger custom event for other scripts
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: this.currentLang } 
        }));
    }

    // Get current page identifier
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('index.html') || path.endsWith('/')) return 'index';
        if (path.includes('about.html')) return 'about';
        if (path.includes('support.html')) return 'support';
        if (path.includes('privacy-policy.html')) return 'privacy';
        if (path.includes('terms-of-service.html')) return 'terms';
        return 'index';
    }

    // Initialize i18n system
    async init() {
        await this.loadLanguage(this.currentLang);
        this.updatePage();
        this.loaded = true;
    }
}

// Create global i18n instance
const i18n = new I18n();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}

// Export for use in other scripts
window.i18n = i18n;

