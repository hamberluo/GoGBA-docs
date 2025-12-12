// Common functionality for all pages

// Detect mobile device by User Agent
function isMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
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
            // Show Telegram and Discord links for users outside China
            const telegramLinks = document.querySelectorAll('.btn-telegram, .community-link-telegram, a[href*="t.me"], a[href*="telegram"]');
            const discordLinks = document.querySelectorAll('.btn-discord, .community-link-discord, a[href*="discord"], a[href*="discord.gg"]');
            const communityLinksContainer = document.querySelector('.community-links');
            
            telegramLinks.forEach(link => {
                link.style.display = 'inline-flex';
            });
            
            discordLinks.forEach(link => {
                link.style.display = 'inline-flex';
            });
            
            // Show the community links container if at least one link is visible
            if (communityLinksContainer) {
                const visibleLinks = Array.from(communityLinksContainer.querySelectorAll('a')).filter(
                    link => {
                        const computedStyle = window.getComputedStyle(link);
                        return computedStyle.display !== 'none' && link.style.display !== 'none';
                    }
                );
                if (visibleLinks.length > 0) {
                    communityLinksContainer.style.display = 'flex';
                }
            }
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
    initMobileMenu();
    initHeaderScroll();
    // Detect IP location and hide links for China
    detectIPLocation();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
