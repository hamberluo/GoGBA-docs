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
            'home.contact.discord': 'Join Discord',
            'about.title': 'About GoGBA',
            'about.what.title': 'What is GoGBA?',
            'about.what.body': 'GoGBA is a handheld game emulator for mobile devices: <strong>Game Boy Advance</strong>, <strong>Game Boy Color</strong>, and <strong>Game Boy</strong> (using the libretro mGBA core). Our goal is a quiet, reliable, and immersive experience for classic portable titles (including fan favorites like Pokémon, Fire Emblem, and Golden Sun on GBA).',
            'about.philosophy.title': 'Our Philosophy',
            'about.philosophy.intro': 'GoGBA is built around a simple principle: <strong>quiet, reliable, immersive, and distraction-free</strong>. We prioritize:',
            'about.philosophy.quiet': '<strong>Quiet:</strong> No ads, no pop-ups, no distractions. Zero interruptions.',
            'about.philosophy.reliable': '<strong>Reliable:</strong> Your saves are safe and never lost. Exit anytime without worry.',
            'about.philosophy.immersive': '<strong>Immersive:</strong> Clean UI with transparent buttons, minimal animations, and optimized touch controls.',
            'about.philosophy.comfortable': '<strong>Comfortable:</strong> 10 dark themes designed for long gaming sessions with eye-friendly colors.',
            'about.philosophy.focused': '<strong>Focused:</strong> We focus on doing the essentials well, rather than overwhelming you with unnecessary options.',
            'about.philosophy.goal': 'Our goal: <strong>Open and continue playing instantly. Play for long sessions without fatigue. Exit without worry.</strong>',
            'about.features.title': 'Key Features',
            'about.feature.seamless': '<strong>Seamless Experience:</strong> Open the app and continue playing instantly. Your progress is always saved. Recent games and favorites are prioritized.',
            'about.feature.save': '<strong>Reliable Save System:</strong> Automatic battery-save writes every 30 seconds while playing, plus saves on exit and when backgrounded. Atomic writes prevent data corruption. Cross-core save compatibility and RTC (Real-Time Clock) support.',
            'about.feature.themes': '<strong>Dark Themes:</strong> 10 carefully designed dark themes (Catppuccin Mocha, Dracula, Nord, Gruvbox, Tokyo Night, One Dark, Monokai, Rose Pine, Kanagawa, OLED Neon) optimized for eye comfort during long sessions.',
            'about.feature.interface': '<strong>Clean Interface:</strong> Minimal, distraction-free UI with transparent virtual buttons (10%-100% opacity adjustable). No UI noise, no distractions.',
            'about.feature.touch': '<strong>Optimized Touch Controls:</strong> Normal mode (standard GBA layout) and Arcade mode (LRAB four-directional buttons). Haptic feedback with adjustable strength. Directional stick optimization for smooth control.',
            'about.feature.gamepad': '<strong>Gamepad Support:</strong> Full controller support with customizable button mapping. Option to hide virtual buttons when gamepad is connected. Works on both Android and iOS.',
            'about.feature.ra': '<strong>RetroAchievements Integration:</strong> Unlock achievements, track progress, compete on leaderboards. Rich Presence support shows your game status. Hardcore and Encore modes available.',
            'about.feature.layout': '<strong>Flexible Layout:</strong> Portrait or landscape mode with orientation locking. No unwanted screen rotation during gameplay.',
            'about.feature.speed': '<strong>Speed Control:</strong> Adjust game speed from 1x to 3x. Optional audio muting during speed-up for focused gameplay.',
            'about.feature.filters': '<strong>Video Rendering Filters:</strong> LCD, scanlines, bilinear, and HQ2x filters for authentic retro visuals.',
            'about.feature.library': '<strong>Game Library Management:</strong> Auto-scan game directory, favorite games, search functionality, list/grid view toggle. Support for external app file opening (<code>.gba</code>, <code>.gbc</code>, <code>.gb</code>, and <code>.zip</code>).',
            'about.feature.bios': '<strong>BIOS Management:</strong> Optional BIOS file import for enhanced game compatibility.',
            'about.feature.lang': '<strong>Multi-language:</strong> Support for 24 languages including English, Chinese (Simplified/Traditional/Hong Kong), Japanese, Korean, Spanish, French, German, Portuguese, Arabic, Russian, Italian, Dutch, Swedish, Thai, Filipino, Turkish, Indonesian, Vietnamese, Hindi, Malay, and Ukrainian.',
            'about.feature.covers': '<strong>Custom Covers:</strong> Search and select game covers from the libretro database. Automatic cover matching via SHA1/MD5 hash.',
            'about.feature.premium': '<strong>Premium & Cloud Save:</strong> Optional in-app purchase unlocks Cloud Save, syncing your game progress across devices via Google Drive (Android/cross-platform) or iCloud (iOS). Optional auto-sync keeps saves up to date during gameplay.',
            'about.tech.title': 'Technical Details',
            'about.tech.platform.title': 'Platform Support',
            'about.tech.platform.android': '<strong>Android:</strong> Android 7.0+',
            'about.tech.platform.ios': '<strong>iOS:</strong> iOS 15.0+',
            'about.tech.core.title': 'Core Technology',
            'about.tech.core.intro': 'GoGBA uses:',
            'about.tech.core.mgba': '<strong>libretro mGBA core:</strong> High-performance emulation for GBA, GBC, and GB, based on mGBA, adapted for libretro with native integration for optimal performance',
            'about.tech.core.rcheevos': '<strong>RCheevos:</strong> RetroAchievements integration library for achievement tracking and leaderboards',
            'about.tech.core.flutter': '<strong>Flutter 3.x:</strong> Cross-platform UI framework for consistent experience across Android and iOS',
            'about.tech.core.riverpod': '<strong>Riverpod 3.x:</strong> State management for reliable app behavior',
            'about.tech.core.router': '<strong>go_router 17.x:</strong> Declarative routing for smooth navigation',
            'about.tech.core.firebase': '<strong>Firebase:</strong> Analytics, Crashlytics, and Remote Config (including parameters such as optional AI Screen Translation usage limits) for monitoring, stability, and operational configuration',
            'about.tech.perf.title': 'Performance Optimizations',
            'about.tech.perf.fps': '60 FPS frame rate control with fixed timestep game loop for smooth, consistent gameplay',
            'about.tech.perf.refresh': 'Refresh rate control on Android (automatically set to 60Hz during gameplay)',
            'about.tech.perf.render': 'Efficient rendering with stream-based game screen updates',
            'about.tech.perf.cache': 'Cover image caching for faster library loading',
            'about.tech.perf.native': 'Native libretro integration for optimal performance on both platforms',
            'about.tech.perf.memory': 'Memory-efficient architecture designed for long gaming sessions',
            'about.privacy.title': 'Privacy & Data',
            'about.privacy.intro': 'GoGBA is designed with privacy in mind:',
            'about.privacy.local': 'Core features store all data locally—no account required',
            'about.privacy.notrack': 'No data collection or tracking',
            'about.privacy.cloud': 'Optional Cloud Save requires a Google or Apple account to sync saves across devices',
            'about.privacy.premium': 'Optional Premium upgrade (in-app purchase) unlocks Cloud Save on iOS and Android',
            'about.privacy.ai': 'Optional AI Screen Translation (subscription) sends captured game screen images to Google\'s AI when you use the feature; usage may be capped (limits can be updated via Firebase Remote Config)—see our <a href="privacy-policy.html">Privacy Policy</a>',
            'about.privacy.more': 'For more information, see our <a href="privacy-policy.html">Privacy Policy</a>.',
            'about.legal.title': 'Legal Notice',
            'about.legal.body': 'GoGBA is an emulation tool. You are responsible for ensuring you have the legal right to use any ROM files you load into the app. We do not provide, distribute, or facilitate access to ROM files. Please only use ROM files for games you legally own.',
            'about.legal.more': 'For more information, see our <a href="terms-of-service.html">Terms of Service</a>.',
            'about.contact.title': 'Contact',
            'about.contact.intro': 'For questions, feedback, or support, please contact us:',
            'about.contact.email': '<strong>Email:</strong> <a href="mailto:hamberluo@gmail.com">hamberluo@gmail.com</a>',
            'about.contact.support': 'Visit our <a href="support.html">Support page</a> for frequently asked questions and troubleshooting help.',
            'about.maturity.title': 'Product Maturity',
            'about.maturity.intro': 'GoGBA has reached production-ready status with complete core functionality:',
            'about.maturity.emulation': 'Complete handheld emulation (GBA, GBC, GB) with the libretro mGBA core',
            'about.maturity.platform': 'Dual platform support (Android + iOS) with native integration',
            'about.maturity.save': 'Reliable save system with automatic saves and atomic writes',
            'about.maturity.library': 'Game library management with auto-scan, favorites, search, and list/grid views',
            'about.maturity.controls': 'Virtual button controls with Normal/Arcade modes and haptic feedback',
            'about.maturity.gamepad': 'Full gamepad support with customizable button mapping',
            'about.maturity.ra': 'RetroAchievements integration with achievements, leaderboards, and Rich Presence',
            'about.maturity.lang': 'Multi-language support (24 languages, including App Store metadata)',
            'about.maturity.themes': '10 dark themes optimized for long sessions',
            'about.maturity.covers': 'Game cover search and automatic matching',
            'about.maturity.filters': 'Video rendering filters (LCD, scanlines, bilinear, HQ2x)',
            'about.maturity.bios': 'BIOS management for enhanced compatibility',
            'about.maturity.premium': 'Premium in-app purchase with Cloud Save (Google Drive / iCloud)',
            'about.maturity.perf': 'Performance optimizations for smooth 60 FPS gameplay',
            'about.maturity.deploy': 'Automated deployment infrastructure (Fastlane)',
            'about.maturity.monitor': 'Monitoring and analytics (Firebase Analytics + Crashlytics)'
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
            'home.contact.discord': '加入 Discord',
            'about.title': '关于 GoGBA',
            'about.what.title': '什么是 GoGBA？',
            'about.what.body': 'GoGBA 是一款面向移动设备的掌机游戏模拟器，支持 <strong>Game Boy Advance</strong>、<strong>Game Boy Color</strong> 和 <strong>Game Boy</strong>（采用 libretro mGBA 核心）。我们的目标，是为经典掌机游戏带来安静、可靠、沉浸的体验（包括 GBA 上备受喜爱的 Pokémon、Fire Emblem 和 Golden Sun 等作品）。',
            'about.philosophy.title': '我们的理念',
            'about.philosophy.intro': 'GoGBA 围绕一个简单的原则打造：<strong>安静、可靠、沉浸、无干扰</strong>。我们优先关注：',
            'about.philosophy.quiet': '<strong>安静：</strong>无广告、无弹窗、无干扰。零打扰。',
            'about.philosophy.reliable': '<strong>可靠：</strong>存档安全无虞，绝不丢失。随时退出无后顾之忧。',
            'about.philosophy.immersive': '<strong>沉浸：</strong>简洁的界面，搭配透明按钮、极简动画与优化的触控操作。',
            'about.philosophy.comfortable': '<strong>舒适：</strong>10 套深色主题，专为长时间游戏设计，配色护眼。',
            'about.philosophy.focused': '<strong>专注：</strong>我们专注把核心做好，而不是用繁杂的选项让你不知所措。',
            'about.philosophy.goal': '我们的目标：<strong>随开随玩，立即继续。长时间游玩也不疲劳。退出无后顾之忧。</strong>',
            'about.features.title': '核心功能',
            'about.feature.seamless': '<strong>无缝体验：</strong>打开应用即可立即继续游戏。进度始终保存，最近游玩和收藏的游戏会优先显示。',
            'about.feature.save': '<strong>可靠存档系统：</strong>游戏中每 30 秒自动写入电池存档，退出和切到后台时也会保存。原子写入防止数据损坏。支持跨核心存档兼容与 RTC（实时时钟）。',
            'about.feature.themes': '<strong>深色主题：</strong>10 套精心设计的深色主题（Catppuccin Mocha、Dracula、Nord、Gruvbox、Tokyo Night、One Dark、Monokai、Rose Pine、Kanagawa、OLED Neon），为长时间游戏护眼优化。',
            'about.feature.interface': '<strong>简洁界面：</strong>极简、无干扰的界面，配备透明虚拟按钮（不透明度 10%-100% 可调）。无界面噪音，无干扰。',
            'about.feature.touch': '<strong>优化触控操作：</strong>普通模式（标准 GBA 布局）与街机模式（LRAB 四向按钮）。触觉反馈强度可调。方向摇杆优化，操作流畅。',
            'about.feature.gamepad': '<strong>手柄支持：</strong>完整手柄支持，按键映射可自定义。连接手柄时可选择隐藏虚拟按钮。Android 与 iOS 均可使用。',
            'about.feature.ra': '<strong>RetroAchievements 集成：</strong>解锁成就、追踪进度、在排行榜上竞技。Rich Presence 展示你的游戏状态。提供 Hardcore 与 Encore 模式。',
            'about.feature.layout': '<strong>灵活布局：</strong>竖屏或横屏模式，支持方向锁定。游戏过程中不会发生意外的屏幕旋转。',
            'about.feature.speed': '<strong>速度控制：</strong>将游戏速度调整为 1x 至 3x。加速时可选静音，专注游戏。',
            'about.feature.filters': '<strong>视频渲染滤镜：</strong>LCD、扫描线、双线性与 HQ2x 滤镜，还原地道的复古画面。',
            'about.feature.library': '<strong>游戏库管理：</strong>自动扫描游戏目录、收藏游戏、搜索功能、列表/网格视图切换。支持从外部应用打开文件（<code>.gba</code>、<code>.gbc</code>、<code>.gb</code> 与 <code>.zip</code>）。',
            'about.feature.bios': '<strong>BIOS 管理：</strong>可选导入 BIOS 文件，增强游戏兼容性。',
            'about.feature.lang': '<strong>多语言：</strong>支持 24 种语言，包括英语、中文（简体/繁体/香港）、日语、韩语、西班牙语、法语、德语、葡萄牙语、阿拉伯语、俄语、意大利语、荷兰语、瑞典语、泰语、菲律宾语、土耳其语、印尼语、越南语、印地语、马来语与乌克兰语。',
            'about.feature.covers': '<strong>自定义封面：</strong>从 libretro 数据库搜索并选择游戏封面。通过 SHA1/MD5 哈希自动匹配封面。',
            'about.feature.premium': '<strong>Premium 与 Cloud Save：</strong>可选的应用内购买可解锁 Cloud Save，通过 Google Drive（Android/跨平台）或 iCloud（iOS）在多设备间同步游戏进度。可选的自动同步让存档在游戏中保持最新。',
            'about.tech.title': '技术细节',
            'about.tech.platform.title': '平台支持',
            'about.tech.platform.android': '<strong>Android：</strong>Android 7.0+',
            'about.tech.platform.ios': '<strong>iOS：</strong>iOS 15.0+',
            'about.tech.core.title': '核心技术',
            'about.tech.core.intro': 'GoGBA 采用：',
            'about.tech.core.mgba': '<strong>libretro mGBA 核心：</strong>面向 GBA、GBC 与 GB 的高性能模拟，基于 mGBA 适配 libretro，并通过原生集成实现最佳性能',
            'about.tech.core.rcheevos': '<strong>RCheevos：</strong>RetroAchievements 集成库，用于成就追踪与排行榜',
            'about.tech.core.flutter': '<strong>Flutter 3.x：</strong>跨平台 UI 框架，在 Android 与 iOS 上提供一致体验',
            'about.tech.core.riverpod': '<strong>Riverpod 3.x：</strong>状态管理，保障应用行为可靠',
            'about.tech.core.router': '<strong>go_router 17.x：</strong>声明式路由，实现流畅导航',
            'about.tech.core.firebase': '<strong>Firebase：</strong>Analytics、Crashlytics 与 Remote Config（包含可选的 AI 屏幕翻译使用上限等参数），用于监控、稳定性与运营配置',
            'about.tech.perf.title': '性能优化',
            'about.tech.perf.fps': '60 FPS 帧率控制，配合固定时间步长的游戏循环，画面流畅一致',
            'about.tech.perf.refresh': 'Android 上的刷新率控制（游戏中自动设为 60Hz）',
            'about.tech.perf.render': '基于流的游戏画面更新，渲染高效',
            'about.tech.perf.cache': '封面图片缓存，加快游戏库加载',
            'about.tech.perf.native': '原生 libretro 集成，在两个平台上均实现最佳性能',
            'about.tech.perf.memory': '内存高效的架构，专为长时间游戏设计',
            'about.privacy.title': '隐私与数据',
            'about.privacy.intro': 'GoGBA 在设计时充分考虑隐私：',
            'about.privacy.local': '核心功能将所有数据保存在本地——无需账户',
            'about.privacy.notrack': '不进行数据收集或追踪',
            'about.privacy.cloud': '可选的 Cloud Save 需要 Google 或 Apple 账户，以在多设备间同步存档',
            'about.privacy.premium': '可选的 Premium 升级（应用内购买）可在 iOS 与 Android 上解锁 Cloud Save',
            'about.privacy.ai': '可选的 AI 屏幕翻译（订阅）会在你使用该功能时，将捕获的游戏画面图片发送给 Google 的 AI；用量可能设有上限（上限可通过 Firebase Remote Config 更新）——详见我们的<a href="privacy-policy.html">隐私政策</a>',
            'about.privacy.more': '了解更多信息，请查看我们的<a href="privacy-policy.html">隐私政策</a>。',
            'about.legal.title': '法律声明',
            'about.legal.body': 'GoGBA 是一款模拟工具。你需自行确保拥有合法权利使用加载到应用中的任何 ROM 文件。我们不提供、不分发，也不协助获取 ROM 文件。请仅使用你合法拥有的游戏的 ROM 文件。',
            'about.legal.more': '了解更多信息，请查看我们的<a href="terms-of-service.html">服务条款</a>。',
            'about.contact.title': '联系',
            'about.contact.intro': '如有疑问、反馈或需要支持，请联系我们：',
            'about.contact.email': '<strong>邮箱：</strong><a href="mailto:hamberluo@gmail.com">hamberluo@gmail.com</a>',
            'about.contact.support': '访问我们的<a href="support.html">支持页面</a>，查看常见问题与故障排查帮助。',
            'about.maturity.title': '产品成熟度',
            'about.maturity.intro': 'GoGBA 已达到可投入生产的状态，核心功能完备：',
            'about.maturity.emulation': '完整的掌机模拟（GBA、GBC、GB），采用 libretro mGBA 核心',
            'about.maturity.platform': '双平台支持（Android + iOS），原生集成',
            'about.maturity.save': '可靠的存档系统，支持自动保存与原子写入',
            'about.maturity.library': '游戏库管理，支持自动扫描、收藏、搜索与列表/网格视图',
            'about.maturity.controls': '虚拟按钮操作，含普通/街机模式与触觉反馈',
            'about.maturity.gamepad': '完整手柄支持，按键映射可自定义',
            'about.maturity.ra': 'RetroAchievements 集成，含成就、排行榜与 Rich Presence',
            'about.maturity.lang': '多语言支持（24 种语言，含 App Store 元数据）',
            'about.maturity.themes': '10 套深色主题，为长时间游戏优化',
            'about.maturity.covers': '游戏封面搜索与自动匹配',
            'about.maturity.filters': '视频渲染滤镜（LCD、扫描线、双线性、HQ2x）',
            'about.maturity.bios': 'BIOS 管理，增强兼容性',
            'about.maturity.premium': 'Premium 应用内购买，含 Cloud Save（Google Drive / iCloud）',
            'about.maturity.perf': '性能优化，流畅的 60 FPS 游戏体验',
            'about.maturity.deploy': '自动化部署基础设施（Fastlane）',
            'about.maturity.monitor': '监控与分析（Firebase Analytics + Crashlytics）'
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
            'home.contact.discord': '加入 Discord',
            'about.title': '關於 GoGBA',
            'about.what.title': '什麼是 GoGBA？',
            'about.what.body': 'GoGBA 是一款面向行動裝置的掌機遊戲模擬器，支援 <strong>Game Boy Advance</strong>、<strong>Game Boy Color</strong> 與 <strong>Game Boy</strong>（採用 libretro mGBA 核心）。我們的目標，是為經典掌機遊戲帶來安靜、可靠、沉浸的體驗（包括 GBA 上備受喜愛的 Pokémon、Fire Emblem 與 Golden Sun 等作品）。',
            'about.philosophy.title': '我們的理念',
            'about.philosophy.intro': 'GoGBA 圍繞一個簡單的原則打造：<strong>安靜、可靠、沉浸、無干擾</strong>。我們優先關注：',
            'about.philosophy.quiet': '<strong>安靜：</strong>無廣告、無彈窗、無干擾。零打擾。',
            'about.philosophy.reliable': '<strong>可靠：</strong>存檔安全無虞，絕不遺失。隨時退出無後顧之憂。',
            'about.philosophy.immersive': '<strong>沉浸：</strong>簡潔的介面，搭配透明按鈕、極簡動畫與優化的觸控操作。',
            'about.philosophy.comfortable': '<strong>舒適：</strong>10 套深色主題，專為長時間遊戲設計，配色護眼。',
            'about.philosophy.focused': '<strong>專注：</strong>我們專注把核心做好，而不是用繁雜的選項讓你不知所措。',
            'about.philosophy.goal': '我們的目標：<strong>隨開隨玩，立即繼續。長時間遊玩也不疲勞。退出無後顧之憂。</strong>',
            'about.features.title': '核心功能',
            'about.feature.seamless': '<strong>無縫體驗：</strong>打開應用即可立即繼續遊戲。進度始終保存，最近遊玩和收藏的遊戲會優先顯示。',
            'about.feature.save': '<strong>可靠存檔系統：</strong>遊戲中每 30 秒自動寫入電池存檔，退出和切到背景時也會保存。原子寫入防止資料損毀。支援跨核心存檔相容與 RTC（即時時鐘）。',
            'about.feature.themes': '<strong>深色主題：</strong>10 套精心設計的深色主題（Catppuccin Mocha、Dracula、Nord、Gruvbox、Tokyo Night、One Dark、Monokai、Rose Pine、Kanagawa、OLED Neon），為長時間遊戲護眼優化。',
            'about.feature.interface': '<strong>簡潔介面：</strong>極簡、無干擾的介面，配備透明虛擬按鈕（不透明度 10%-100% 可調）。無介面雜訊，無干擾。',
            'about.feature.touch': '<strong>優化觸控操作：</strong>普通模式（標準 GBA 佈局）與街機模式（LRAB 四向按鈕）。觸覺回饋強度可調。方向搖桿優化，操作流暢。',
            'about.feature.gamepad': '<strong>手柄支援：</strong>完整手柄支援，按鍵映射可自訂。連接手柄時可選擇隱藏虛擬按鈕。Android 與 iOS 均可使用。',
            'about.feature.ra': '<strong>RetroAchievements 整合：</strong>解鎖成就、追蹤進度、在排行榜上競技。Rich Presence 展示你的遊戲狀態。提供 Hardcore 與 Encore 模式。',
            'about.feature.layout': '<strong>靈活佈局：</strong>直向或橫向模式，支援方向鎖定。遊戲過程中不會發生意外的螢幕旋轉。',
            'about.feature.speed': '<strong>速度控制：</strong>將遊戲速度調整為 1x 至 3x。加速時可選靜音，專注遊戲。',
            'about.feature.filters': '<strong>視訊渲染濾鏡：</strong>LCD、掃描線、雙線性與 HQ2x 濾鏡，還原道地的復古畫面。',
            'about.feature.library': '<strong>遊戲庫管理：</strong>自動掃描遊戲目錄、收藏遊戲、搜尋功能、清單/網格檢視切換。支援從外部應用打開檔案（<code>.gba</code>、<code>.gbc</code>、<code>.gb</code> 與 <code>.zip</code>）。',
            'about.feature.bios': '<strong>BIOS 管理：</strong>可選匯入 BIOS 檔案，增強遊戲相容性。',
            'about.feature.lang': '<strong>多語言：</strong>支援 24 種語言，包括英語、中文（簡體/繁體/香港）、日語、韓語、西班牙語、法語、德語、葡萄牙語、阿拉伯語、俄語、義大利語、荷蘭語、瑞典語、泰語、菲律賓語、土耳其語、印尼語、越南語、印地語、馬來語與烏克蘭語。',
            'about.feature.covers': '<strong>自訂封面：</strong>從 libretro 資料庫搜尋並選擇遊戲封面。透過 SHA1/MD5 雜湊自動匹配封面。',
            'about.feature.premium': '<strong>Premium 與 Cloud Save：</strong>可選的應用內購買可解鎖 Cloud Save，透過 Google Drive（Android/跨平台）或 iCloud（iOS）在多裝置間同步遊戲進度。可選的自動同步讓存檔在遊戲中保持最新。',
            'about.tech.title': '技術細節',
            'about.tech.platform.title': '平台支援',
            'about.tech.platform.android': '<strong>Android：</strong>Android 7.0+',
            'about.tech.platform.ios': '<strong>iOS：</strong>iOS 15.0+',
            'about.tech.core.title': '核心技術',
            'about.tech.core.intro': 'GoGBA 採用：',
            'about.tech.core.mgba': '<strong>libretro mGBA 核心：</strong>面向 GBA、GBC 與 GB 的高效能模擬，基於 mGBA 適配 libretro，並透過原生整合實現最佳效能',
            'about.tech.core.rcheevos': '<strong>RCheevos：</strong>RetroAchievements 整合函式庫，用於成就追蹤與排行榜',
            'about.tech.core.flutter': '<strong>Flutter 3.x：</strong>跨平台 UI 框架，在 Android 與 iOS 上提供一致體驗',
            'about.tech.core.riverpod': '<strong>Riverpod 3.x：</strong>狀態管理，保障應用行為可靠',
            'about.tech.core.router': '<strong>go_router 17.x：</strong>宣告式路由，實現流暢導航',
            'about.tech.core.firebase': '<strong>Firebase：</strong>Analytics、Crashlytics 與 Remote Config（包含可選的 AI 螢幕翻譯使用上限等參數），用於監控、穩定性與營運配置',
            'about.tech.perf.title': '效能優化',
            'about.tech.perf.fps': '60 FPS 影格率控制，配合固定時間步長的遊戲迴圈，畫面流暢一致',
            'about.tech.perf.refresh': 'Android 上的更新率控制（遊戲中自動設為 60Hz）',
            'about.tech.perf.render': '基於串流的遊戲畫面更新，渲染高效',
            'about.tech.perf.cache': '封面圖片快取，加快遊戲庫載入',
            'about.tech.perf.native': '原生 libretro 整合，在兩個平台上均實現最佳效能',
            'about.tech.perf.memory': '記憶體高效的架構，專為長時間遊戲設計',
            'about.privacy.title': '隱私與資料',
            'about.privacy.intro': 'GoGBA 在設計時充分考量隱私：',
            'about.privacy.local': '核心功能將所有資料保存在本機——無需帳戶',
            'about.privacy.notrack': '不進行資料收集或追蹤',
            'about.privacy.cloud': '可選的 Cloud Save 需要 Google 或 Apple 帳戶，以在多裝置間同步存檔',
            'about.privacy.premium': '可選的 Premium 升級（應用內購買）可在 iOS 與 Android 上解鎖 Cloud Save',
            'about.privacy.ai': '可選的 AI 螢幕翻譯（訂閱）會在你使用該功能時，將擷取的遊戲畫面圖片傳送給 Google 的 AI；用量可能設有上限（上限可透過 Firebase Remote Config 更新）——詳見我們的<a href="privacy-policy.html">隱私政策</a>',
            'about.privacy.more': '了解更多資訊，請查看我們的<a href="privacy-policy.html">隱私政策</a>。',
            'about.legal.title': '法律聲明',
            'about.legal.body': 'GoGBA 是一款模擬工具。你須自行確保擁有合法權利使用載入到應用中的任何 ROM 檔案。我們不提供、不散布，也不協助取得 ROM 檔案。請僅使用你合法擁有的遊戲的 ROM 檔案。',
            'about.legal.more': '了解更多資訊，請查看我們的<a href="terms-of-service.html">服務條款</a>。',
            'about.contact.title': '聯繫',
            'about.contact.intro': '如有疑問、回饋或需要支援，請聯繫我們：',
            'about.contact.email': '<strong>信箱：</strong><a href="mailto:hamberluo@gmail.com">hamberluo@gmail.com</a>',
            'about.contact.support': '造訪我們的<a href="support.html">支援頁面</a>，查看常見問題與疑難排解協助。',
            'about.maturity.title': '產品成熟度',
            'about.maturity.intro': 'GoGBA 已達到可投入生產的狀態，核心功能完備：',
            'about.maturity.emulation': '完整的掌機模擬（GBA、GBC、GB），採用 libretro mGBA 核心',
            'about.maturity.platform': '雙平台支援（Android + iOS），原生整合',
            'about.maturity.save': '可靠的存檔系統，支援自動保存與原子寫入',
            'about.maturity.library': '遊戲庫管理，支援自動掃描、收藏、搜尋與清單/網格檢視',
            'about.maturity.controls': '虛擬按鈕操作，含普通/街機模式與觸覺回饋',
            'about.maturity.gamepad': '完整手柄支援，按鍵映射可自訂',
            'about.maturity.ra': 'RetroAchievements 整合，含成就、排行榜與 Rich Presence',
            'about.maturity.lang': '多語言支援（24 種語言，含 App Store 元資料）',
            'about.maturity.themes': '10 套深色主題，為長時間遊戲優化',
            'about.maturity.covers': '遊戲封面搜尋與自動匹配',
            'about.maturity.filters': '視訊渲染濾鏡（LCD、掃描線、雙線性、HQ2x）',
            'about.maturity.bios': 'BIOS 管理，增強相容性',
            'about.maturity.premium': 'Premium 應用內購買，含 Cloud Save（Google Drive / iCloud）',
            'about.maturity.perf': '效能優化，流暢的 60 FPS 遊戲體驗',
            'about.maturity.deploy': '自動化部署基礎設施（Fastlane）',
            'about.maturity.monitor': '監控與分析（Firebase Analytics + Crashlytics）'
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
