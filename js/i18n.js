// i18n: dictionary + detect/render/switch. localStorage > navigator.language > en
(function () {
    'use strict';

    var STORAGE_KEY = 'lang';
    var SUPPORTED = ['en', 'zh-Hans', 'zh-Hant'];

    var I18N = {
        'en': {
            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.support': 'Support',
            'nav.privacy': 'Privacy Policy',
            'nav.terms': 'Terms of Service',
            'nav.license': 'License',
            'footer.rights': '© 2026 GoGBA. All rights reserved.',
            'home.hero.subtitle': 'A quiet, reliable, and immersive handheld emulator',
            'home.hero.description': 'Play Game Boy Advance, Game Boy Color, and Game Boy classics with optimized touch controls, seamless saves, RetroAchievements integration, and full gamepad support.',
            'home.features.title': 'Key Features',
            'home.feature.seamless.title': 'Seamless Experience',
            'home.feature.seamless.desc': 'Open and continue playing instantly. Your saves are always safe.',
            'home.feature.save.title': 'Reliable Save System',
            'home.feature.save.desc': 'Automatic battery-save writes every 30 seconds while you play, plus saves on exit and when backgrounded.',
            'home.feature.touch.title': 'Optimized Touch Controls',
            'home.feature.touch.desc': 'Normal and Arcade control modes with haptic feedback.',
            'home.feature.gamepad.title': 'Gamepad Support',
            'home.feature.gamepad.desc': 'Full controller support with customizable button mapping.',
            'home.feature.ra.title': 'RetroAchievements',
            'home.feature.ra.desc': 'Unlock achievements and compete on leaderboards.',
            'home.feature.themes.title': 'Dark Themes',
            'home.feature.themes.desc': '10 carefully designed dark themes for eye comfort.',
            'home.demo.title': 'Demo Games',
            'home.demo.name': 'A Rushed Hack Job',
            'home.demo.desc': 'A GBA-format homebrew demo ROM to try GoGBA (also supports GBC and GB titles).',
            'home.demo.download': 'Download Demo Game',
            'home.contact.title': 'Contact & Support',
            'home.contact.discord': 'Join Discord'
        },
        'zh-Hans': {
            'nav.home': '首页',
            'nav.about': '关于',
            'nav.support': '支持',
            'nav.privacy': '隐私政策',
            'nav.terms': '服务条款',
            'nav.license': '许可证',
            'footer.rights': '© 2026 GoGBA。保留所有权利。',
            'home.hero.subtitle': '安静、可靠、沉浸的掌机模拟器',
            'home.hero.description': '流畅畅玩 Game Boy Advance、Game Boy Color 与 Game Boy 经典游戏，支持优化的触控操作、无缝存档、RetroAchievements 成就集成与完整手柄支持。',
            'home.features.title': '核心功能',
            'home.feature.seamless.title': '无缝体验',
            'home.feature.seamless.desc': '随开随玩，存档始终安全。',
            'home.feature.save.title': '可靠存档系统',
            'home.feature.save.desc': '游戏中每 30 秒自动写入电池存档，退出和切到后台时也会保存。',
            'home.feature.touch.title': '优化触控操作',
            'home.feature.touch.desc': '提供普通与街机两种操作模式，带触觉反馈。',
            'home.feature.gamepad.title': '手柄支持',
            'home.feature.gamepad.desc': '完整手柄支持，按键可自定义映射。',
            'home.feature.ra.title': 'RetroAchievements',
            'home.feature.ra.desc': '解锁成就，同台竞技排行榜。',
            'home.feature.themes.title': '深色主题',
            'home.feature.themes.desc': '10 套精心设计的深色主题，护眼舒适。',
            'home.demo.title': '演示游戏',
            'home.demo.name': 'A Rushed Hack Job',
            'home.demo.desc': '一个 GBA 格式的自制演示 ROM，用于试玩 GoGBA（同时支持 GBC 与 GB 游戏）。',
            'home.demo.download': '下载演示游戏',
            'home.contact.title': '联系与支持',
            'home.contact.discord': '加入 Discord'
        },
        'zh-Hant': {
            'nav.home': '首頁',
            'nav.about': '關於',
            'nav.support': '支援',
            'nav.privacy': '隱私政策',
            'nav.terms': '服務條款',
            'nav.license': '授權條款',
            'footer.rights': '© 2026 GoGBA。保留所有權利。',
            'home.hero.subtitle': '安靜、可靠、沉浸的掌機模擬器',
            'home.hero.description': '流暢暢玩 Game Boy Advance、Game Boy Color 與 Game Boy 經典遊戲，支援優化的觸控操作、無縫存檔、RetroAchievements 成就整合與完整手柄支援。',
            'home.features.title': '核心功能',
            'home.feature.seamless.title': '無縫體驗',
            'home.feature.seamless.desc': '隨開隨玩，存檔始終安全。',
            'home.feature.save.title': '可靠存檔系統',
            'home.feature.save.desc': '遊戲中每 30 秒自動寫入電池存檔，退出和切到背景時也會保存。',
            'home.feature.touch.title': '優化觸控操作',
            'home.feature.touch.desc': '提供普通與街機兩種操作模式，帶觸覺回饋。',
            'home.feature.gamepad.title': '手柄支援',
            'home.feature.gamepad.desc': '完整手柄支援，按鍵可自訂映射。',
            'home.feature.ra.title': 'RetroAchievements',
            'home.feature.ra.desc': '解鎖成就，同台競技排行榜。',
            'home.feature.themes.title': '深色主題',
            'home.feature.themes.desc': '10 套精心設計的深色主題，護眼舒適。',
            'home.demo.title': '演示遊戲',
            'home.demo.name': 'A Rushed Hack Job',
            'home.demo.desc': '一個 GBA 格式的自製演示 ROM，用於試玩 GoGBA（同時支援 GBC 與 GB 遊戲）。',
            'home.demo.download': '下載演示遊戲',
            'home.contact.title': '聯繫與支援',
            'home.contact.discord': '加入 Discord'
        }
    };

    function getStoredLang() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function mapNavigatorLang() {
        var l = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        if (l.indexOf('zh') === 0) {
            if (l.indexOf('tw') > -1 || l.indexOf('hk') > -1 || l.indexOf('mo') > -1 || l.indexOf('hant') > -1) {
                return 'zh-Hant';
            }
            return 'zh-Hans';
        }
        return 'en';
    }

    function resolveLang() {
        var stored = getStoredLang();
        if (SUPPORTED.indexOf(stored) > -1) return stored;
        return mapNavigatorLang();
    }

    function t(lang, key) {
        var dict = I18N[lang] || I18N.en;
        return (key in dict) ? dict[key] : (I18N.en[key] !== undefined ? I18N.en[key] : null);
    }

    function render(lang) {
        var nodes = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < nodes.length; i++) {
            var key = nodes[i].getAttribute('data-i18n');
            var val = t(lang, key);
            if (val !== null) nodes[i].textContent = val;
        }
        var htmlNodes = document.querySelectorAll('[data-i18n-html]');
        for (var j = 0; j < htmlNodes.length; j++) {
            var hkey = htmlNodes[j].getAttribute('data-i18n-html');
            var hval = t(lang, hkey);
            if (hval !== null) htmlNodes[j].innerHTML = hval;
        }
        var attrNodes = document.querySelectorAll('[data-i18n-attr]');
        for (var k = 0; k < attrNodes.length; k++) {
            var spec = attrNodes[k].getAttribute('data-i18n-attr');
            var pairs = spec.split(';');
            for (var p = 0; p < pairs.length; p++) {
                var pair = pairs[p].split(':');
                if (pair.length === 2) {
                    var av = t(lang, pair[1]);
                    if (av !== null) attrNodes[k].setAttribute(pair[0], av);
                }
            }
        }
        document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : lang);
        updateSwitcher(lang);
    }

    function updateSwitcher(lang) {
        var sel = document.querySelector('.lang-switch');
        if (sel && sel.value !== lang) sel.value = lang;
    }

    function setLang(lang) {
        if (SUPPORTED.indexOf(lang) === -1) return;
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
        render(lang);
    }

    function initI18n() {
        render(resolveLang());
        var sel = document.querySelector('.lang-switch');
        if (sel) {
            sel.addEventListener('change', function () { setLang(sel.value); });
        }
    }

    window.GoGBAI18n = { init: initI18n, setLang: setLang, resolve: resolveLang, SUPPORTED: SUPPORTED };
})();
