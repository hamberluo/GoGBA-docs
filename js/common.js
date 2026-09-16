// Common functionality for all pages

// Hide the store the visitor's phone cannot install from. Both badges are
// visible by default (styles.css), so this only ever removes one: anything not
// recognised as iOS or Android — desktop included — keeps both.
function initPlatformSpecificDownloads() {
    const iosBadge = document.querySelector('.app-store-badge[data-platform="ios"]');
    const androidBadge = document.querySelector('.google-play-badge[data-platform="android"]');
    if (!iosBadge || !androidBadge) return;

    const ua = (navigator.userAgent || '').toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
        androidBadge.style.display = 'none';
    } else if (/android/.test(ua)) {
        iosBadge.style.display = 'none';
    }
}

// Mobile menu toggle functionality
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        // Menu is collapsed by default (removed auto-open on mobile devices)

        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            const isExpanded = mobileToggle.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Header scroll shrink functionality
function initHeaderScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    const scrollThreshold = 50;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        header.classList.toggle('scrolled', scrollTop > scrollThreshold);
    }

    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Check initial scroll position
    handleScroll();
}

// Discord links ship hidden (styles.css .btn-discord) and are revealed only to
// a reader we have positively established is not a Chinese one — Discord is
// unreachable there, so offering the link is at best a dead end.
//
// Two independent signals each mark a reader as Chinese, and either one alone
// is enough to keep the link hidden:
//
//   - the IP. Anything we cannot prove to be outside CN counts as CN: a failed
//     lookup, a non-200, a missing country_code. Treating "unknown" as abroad
//     would show the link on exactly the request we know least about.
//   - the language. Reading the site in Simplified or Traditional Chinese
//     marks a Chinese reader regardless of where the IP lands.
//
// So the link needs a confirmed non-CN IP *and* English to appear, and every
// unproven case falls to hidden.
let ipSaysChina = true;

function langSaysChina() {
    // The language actually rendered, not the stored preference: a page that
    // serves only some languages resolves to one of its own.
    const lang = window.GoGBAI18n ? window.GoGBAI18n.current() : null;
    // Anything that is not the English build is treated as Chinese — the site
    // ships no third language, so this is the whole of the non-en set.
    return lang !== 'en';
}

function updateDiscordVisibility() {
    const show = !ipSaysChina && !langSaysChina();
    document.querySelectorAll('.btn-discord').forEach(link => {
        link.style.display = show ? 'inline-flex' : 'none';
    });
    // The Contact & Support section holds nothing but the Discord button, so a
    // hidden button would leave a heading over empty space. It travels with the
    // link rather than being hidden in the markup, keeping one decision point.
    document.querySelectorAll('[data-discord-section]').forEach(section => {
        section.hidden = !show;
    });
}

// ipapi.co is the only endpoint: the site is HTTPS, and ip-api.com's free tier
// is HTTP-only, so a request to it is blocked as mixed content every time.
async function detectIPLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/', {
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);

        const data = await response.json();
        // Only a country_code we actually received, and that is not CN, clears
        // the IP check; everything else leaves it set.
        ipSaysChina = !data.country_code || data.country_code === 'CN';
    } catch (error) {
        console.log('IP geolocation detection failed, treating as CN:', error);
        ipSaysChina = true;
    }
    updateDiscordVisibility();
}

// Initialize when DOM is ready
function init() {
    if (window.GoGBAI18n) window.GoGBAI18n.init();
    initMobileMenu();
    initHeaderScroll();
    // Show platform-specific download cards on mobile
    initPlatformSpecificDownloads();
    // Re-decide on every language switch; the IP verdict is already cached.
    document.addEventListener('gogba:langchange', updateDiscordVisibility);
    // Resolve the IP signal; the link stays hidden until it comes back clear.
    detectIPLocation();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
