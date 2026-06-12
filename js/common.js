// Common functionality for all pages

// Detect mobile device by User Agent
function isMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
}

// Detect operating system
function detectOS() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const userAgentLower = userAgent.toLowerCase();
    
    // Check for iOS
    if (/iphone|ipad|ipod/.test(userAgentLower)) {
        return 'ios';
    }
    
    // Check for Android
    if (/android/.test(userAgentLower)) {
        return 'android';
    }
    
    // Default to unknown (show both on desktop)
    return 'unknown';
}

// Show platform-specific download badges on mobile devices
function initPlatformSpecificDownloads() {
    const iosBadge = document.querySelector('.app-store-badge[data-platform="ios"]');
    const androidBadge = document.querySelector('.google-play-badge[data-platform="android"]');
    
    if (!iosBadge || !androidBadge) return;
    
    // Only apply on mobile devices
    if (isMobileDevice()) {
        const os = detectOS();
        
        if (os === 'ios') {
            // Show iOS badge, hide Android badge
            iosBadge.style.display = 'inline-flex';
            androidBadge.style.display = 'none';
        } else if (os === 'android') {
            // Show Android badge, hide iOS badge
            iosBadge.style.display = 'none';
            androidBadge.style.display = 'inline-flex';
        } else {
            // Unknown OS on mobile - show both (fallback)
            iosBadge.style.display = 'inline-flex';
            androidBadge.style.display = 'inline-flex';
        }
    } else {
        // Desktop - show both badges
        iosBadge.style.display = 'inline-flex';
        androidBadge.style.display = 'inline-flex';
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

    let lastScrollTop = 0;
    const scrollThreshold = 50;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
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

// IP geolocation detection using ip-api.com
async function detectIPLocation() {
    try {
        // Use ip-api.com API to detect user's country code
        // Free tier: 45 requests/minute
        // Try HTTP first (ip-api.com free tier), with fallback handling for HTTPS sites
        let response;
        let data;
        
        try {
            // Try HTTP endpoint (ip-api.com free tier)
            response = await fetch('http://ip-api.com/json/?fields=countryCode', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (response.ok) {
                data = await response.json();
            } else {
                throw new Error('HTTP request failed');
            }
        } catch (httpError) {
            // If HTTP fails (e.g., mixed content blocked), try alternative HTTPS API
            try {
                response = await fetch('https://ipapi.co/json/', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                data = await response.json();
                // ipapi.co uses 'country_code' instead of 'countryCode'
                if (data.country_code) {
                    data.countryCode = data.country_code;
                }
            } catch (httpsError) {
                throw new Error('Both API endpoints failed');
            }
        }
        
        // Only show links if user is NOT in China (CN)
        // Default state: links are hidden, only show if countryCode !== 'CN'
        if (data && data.countryCode && data.countryCode !== 'CN') {
            // Show Discord links for users outside China
            const discordLinks = document.querySelectorAll('.btn-discord, a[href*="discord"], a[href*="discord.gg"]');
            
            discordLinks.forEach(link => {
                link.style.display = 'inline-flex';
            });
        }
        // If countryCode is CN or API fails, links remain hidden (default state)
    } catch (error) {
        // Silently fail if API is unavailable or blocked
        // Links remain hidden by default (fail-safe: hide on error)
        console.log('IP geolocation detection failed:', error);
    }
}

// Initialize when DOM is ready
function init() {
    if (window.GoGBATheme) window.GoGBATheme.init();
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
