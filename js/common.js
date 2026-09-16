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

// Discord links ship hidden (styles.css .btn-discord) and are revealed only
// outside mainland China, where Discord is unreachable. Any failure leaves them
// hidden, which is the safe direction.
//
// ipapi.co is the only endpoint: the site is HTTPS, and ip-api.com's free tier
// is HTTP-only, so a request to it is blocked as mixed content every time.
async function detectIPLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/', {
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);

        const data = await response.json();
        if (data.country_code && data.country_code !== 'CN') {
            document.querySelectorAll('.btn-discord').forEach(link => {
                link.style.display = 'inline-flex';
            });
        }
    } catch (error) {
        console.log('IP geolocation detection failed:', error);
    }
}

// Initialize when DOM is ready
function init() {
    if (window.GoGBAI18n) window.GoGBAI18n.init();
    initMobileMenu();
    initHeaderScroll();
    // Show platform-specific download cards on mobile
    initPlatformSpecificDownloads();
    // Detect IP location and hide links for China
    detectIPLocation();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
