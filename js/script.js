    // ========================================
    // ADVANCED SECURITY & ANTI-TAMPERING PROTECTION
    // ========================================
    (function() {
        'use strict';

        // ========================================
        // 1. KEYBOARD SHORTCUTS BLOCKER
        // ========================================
        document.addEventListener('keydown', (e) => {
            // F12 - DevTools
            if (e.key === 'F12' || e.keyCode === 123) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+I / Cmd+Shift+I - Inspect Element
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 73 || e.key === 'I')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+C / Cmd+Shift+C - Element Picker
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 67 || e.key === 'C')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+J / Cmd+Shift+J - Console
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 74 || e.key === 'J')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+Shift+K - Firefox DevTools
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 75 || e.key === 'K')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+U / Cmd+U - View Source
            if ((e.ctrlKey || e.metaKey) && (e.keyCode === 85 || e.key === 'u' || e.key === 'U')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+S / Cmd+S - Save Page
            if ((e.ctrlKey || e.metaKey) && (e.keyCode === 83 || e.key === 's' || e.key === 'S')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Ctrl+P / Cmd+P - Print
            if ((e.ctrlKey || e.metaKey) && (e.keyCode === 80 || e.key === 'p' || e.key === 'P')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }

            // Alt+F4 - Close Window
            if (e.altKey && (e.keyCode === 115 || e.key === 'F4')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);

        // ========================================
        // 2. CONTEXT MENU BLOCKER
        // ========================================
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, true);

        // ========================================
        // 3. COPY PROTECTION
        // ========================================
        document.addEventListener('copy', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, true);

        document.addEventListener('cut', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, true);

        // ========================================
        // 4. DRAG & DROP PROTECTION
        // ========================================
        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, true);

        document.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, true);

        // ========================================
        // 5. DEVTOOLS DETECTION & RESPONSE
        // ========================================
        let devtoolsOpen = false;
        const devtoolsThreshold = 160;
        
        setInterval(() => {
            const widthThreshold = window.outerWidth - window.innerWidth > devtoolsThreshold;
            const heightThreshold = window.outerHeight - window.innerHeight > devtoolsThreshold;

            if (widthThreshold || heightThreshold) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    console.clear();
                    console.log('%c⚠️ AVISO DE SEGURANÇA', 'color: red; font-size: 20px; font-weight: bold;');
                    console.log('%cNão é permitido acessar ferramentas de desenvolvimento neste site.', 'color: red; font-size: 14px;');
                    // Ofuscar e bloquear
                    try {
                        debugger;
                    } catch (err) {}
                }
            } else {
                devtoolsOpen = false;
            }
        }, 500);

        // ========================================
        // 6. CONSOLE PROTECTION
        // ========================================
        const blockConsole = () => {
            console.clear();
            console.log('%c⚠️ Acesso negado', 'color: red; font-size: 16px;');
        };

        // Clear console periodically
        setInterval(blockConsole, 100);

        // Override console methods
        const noop = () => {};
        console.log = noop;
        console.warn = noop;
        console.error = noop;
        console.debug = noop;
        console.info = noop;
        console.table = noop;
        console.trace = noop;

        // ========================================
        // 6.5 CHROME EXTENSION & SCRAPER DETECTION
        // ========================================
        // Detectar extensões do Chrome
        const detectChromeExtension = () => {
            // Verificar User-Agent para extensões conhecidas
            const extensionBlocklist = [
                'chrome-extension://',
                'moz-extension://',
                'safari-extension://',
                'Ms-Extension://',
                'chrome-search://'
            ];

            try {
                // Verificar acesso a chrome APIs
                if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
                    return true;
                }

                // Verificar se há listeners de extensão
                if (typeof browser !== 'undefined') {
                    return true;
                }

                // Verificar document.currentScript
                const script = document.currentScript;
                if (script && script.src) {
                    for (let blocked of extensionBlocklist) {
                        if (script.src.includes(blocked)) {
                            return true;
                        }
                    }
                }
            } catch (e) {}

            return false;
        };

        if (detectChromeExtension()) {
            console.clear();
            window.location.href = 'about:blank';
            throw new Error('Extension detectada e bloqueada');
        }

        // Monitore continuamente por extensões
        setInterval(() => {
            if (detectChromeExtension()) {
                window.location.reload();
            }
        }, 1000);

        // ========================================
        // 6.6 HTTRACK & WEB SCRAPER DETECTION
        // ========================================
        // Detectar User-Agents de ferramentas de scraping
        const scrapingBots = [
            'HTTrack',
            'wget',
            'curl',
            'urllib',
            'scrapy',
            'GetLeft',
            'CyberSpider',
            'EBrowse',
            'WebCopier',
            'Teleport',
            'Offline',
            'Mata',
            'Zeus',
            'Replay',
            'Googlebot',
            'bot',
            'spider',
            'crawler',
            'HttpClient'
        ];

        const userAgent = navigator.userAgent;
        for (let bot of scrapingBots) {
            if (userAgent.includes(bot)) {
                console.warn('Scraper detectado!');
                window.location.href = 'about:blank';
                throw new Error('Acesso bloqueado');
            }
        }

        // Monitorar downloads suspeitos
        document.addEventListener('beforeunload', (e) => {
            // Verificar se é uma tentativa de download
            if (performance.navigation.type === 2) {
                e.preventDefault();
                e.returnValue = '';
            }
        });

        // ========================================
        // 6.7 ANTI-DOWNLOAD PROTECTION
        // ========================================
        // Desabilitar downloads
        window.addEventListener('beforeunload', (e) => {
            const referrer = document.referrer;
            if (!referrer || referrer === '') {
                // Possível tentativa de scraping
            }
        });

        // Bloquear acesso a recursos críticos
        document.addEventListener('download', (e) => {
            e.preventDefault();
            return false;
        }, true);

        // Verificar requestAnimationFrame para atividade suspeita
        const originalRAF = window.requestAnimationFrame;
        let rafCallCount = 0;
        let rafCheckTime = Date.now();

        window.requestAnimationFrame = function(callback) {
            rafCallCount++;
            if (Date.now() - rafCheckTime > 1000) {
                if (rafCallCount > 100) {
                    // Atividade de script suspeita
                    console.warn('Atividade suspeita detectada');
                }
                rafCallCount = 0;
                rafCheckTime = Date.now();
            }
            return originalRAF(callback);
        };

        // ========================================
        // 6.8 NETWORK REQUEST MONITORING
        // ========================================
        // Interceptar XMLHttpRequest suspeitos
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = args[0];
            
            // Bloquear requests de ferramentas conhecidas
            if (typeof url === 'string') {
                const suspiciousPatterns = [
                    'analytics',
                    'tracking',
                    'sitemap',
                    'robots.txt',
                    'manifest',
                    '.js',
                    '.css',
                    '.html'
                ];

                for (let pattern of suspiciousPatterns) {
                    if (url.includes(pattern) && !url.includes(window.location.hostname)) {
                        console.warn('Request suspeita bloqueada:', url);
                        return Promise.reject(new Error('Bloqueado'));
                    }
                }
            }

            return originalFetch.apply(this, args);
        };

        // Bloquear XMLHttpRequest de origem desconhecida
        const originalXHR = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            // Verificar origem da requisição
            if (typeof url === 'string' && !url.includes(window.location.hostname)) {
                const excludedDomains = ['cdn', 'google', 'cloudflare'];
                let isAllowed = excludedDomains.some(domain => url.includes(domain));
                
                if (!isAllowed && method !== 'GET') {
                    return false;
                }
            }
            return originalXHR.apply(this, arguments);
        };

        // ========================================
        // 6.9 TIMESTAMP MISMATCH DETECTION
        // ========================================
        // Detectar tentativas de manipular data/hora
        const startTime = Date.now();
        setInterval(() => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            
            // Se o tempo está andando para trás = potencial manipulação
            if (elapsed < 0) {
                console.warn('Data/Hora manipulada detectada');
                window.location.reload();
            }
        }, 5000);

        // ========================================
        // 6.10 API FREEZE PROTECTION
        // ========================================
        // Congelar APIs críticas
        try {
            Object.defineProperty(window, 'location', {
                get() { return window.location; },
                set() { /* Block */ }
            });

            // Bloquear Worker creation
            const OriginalWorker = window.Worker;
            window.Worker = function() {
                throw new Error('Workers não permitidos');
            };
            window.Worker.prototype = OriginalWorker.prototype;

            // Bloquear SharedArrayBuffer
            if (typeof SharedArrayBuffer !== 'undefined') {
                window.SharedArrayBuffer = undefined;
            }
        } catch (e) {}

        // ========================================
        // 7. DEBUGGER STATEMENT INJECTION
        // ========================================
        setInterval(() => {
            debugger;
        }, 1000);

        // ========================================
        // 8. TEXT SELECTION PROTECTION
        // ========================================
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        }, true);

        document.addEventListener('mousedown', (e) => {
            if (e.detail > 1) {
                e.preventDefault();
                return false;
            }
        }, true);

        // ========================================
        // 9. ELEMENT INSPECTION BLOCKER
        // ========================================
        window.ondevtoolschange = () => {
            console.clear();
            debugger;
        };

        // Detect inspect element via right-click
        document.addEventListener('mousedown', (e) => {
            if (e.button === 2) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, true);

        // ========================================
        // 10. LOCAL STORAGE PROTECTION
        // ========================================
        try {
            const originalSetItem = Storage.prototype.setItem;
            const originalGetItem = Storage.prototype.getItem;
            
            // Monitor for suspicious access
            Storage.prototype.setItem = function(key, value) {
                if (key.includes('devtools') || key.includes('debug')) {
                    return;
                }
                return originalSetItem.call(this, key, value);
            };
        } catch (e) {}

        // ========================================
        // 11. ANTI-BREAKPOINT DETECTION
        // ========================================
        const checkForBreakpoint = () => {
            const start = performance.now();
            debugger;
            const end = performance.now();
            
            if (end - start > 100) {
                console.clear();
                window.location.reload();
            }
        };

        setInterval(checkForBreakpoint, 5000);

        // ========================================
        // 12. SOURCE MAP BLOCKER
        // ========================================
        Object.defineProperty(console, 'log', {
            value: () => {},
            writable: false,
            configurable: false
        });

        // ========================================
        // 13. IFRAME ESCAPE PROTECTION
        // ========================================
        if (window.self !== window.top) {
            window.top.location = window.self.location;
        }

        // ========================================
        // 14. EXTERNAL TOOL DETECTION
        // ========================================
        setInterval(() => {
            try {
                if (typeof MutationObserver !== 'undefined' && 
                    typeof document.createTreeWalker !== 'undefined') {
                    // Potential scraping tool detected
                    const walker = document.createTreeWalker(
                        document.body,
                        NodeFilter.SHOW_ELEMENT,
                        null,
                        false
                    );
                }
            } catch (e) {}
        }, 1000);

        // ========================================
        // 15. MUTATION OBSERVER LOCKDOWN
        // ========================================
        const originalMutationObserver = MutationObserver;
        window.MutationObserver = function() {
            if (new Error().stack.includes('chrome-extension')) {
                throw new Error('Extension não permitido');
            }
            return new originalMutationObserver(...arguments);
        };

        // ========================================
        // 16. PERFORMANCE MONITORING BLOCK
        // ========================================
        try {
            Object.defineProperty(window.performance, 'memory', {
                value: {},
                writable: false
            });
        } catch (e) {}

        // ========================================
        // 17. PAGE VISIBILITY LOCK
        // ========================================
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.title = 'Voltando...';
            }
        });

        // ========================================
        // 18. SECURITY HEADERS VERIFICATION
        // ========================================
        const verifySecurityHeaders = () => {
            const requiredHeaders = [
                'Content-Security-Policy',
                'X-Frame-Options',
                'X-Content-Type-Options'
            ];
            // Verificação silenciosa
        };

        // ========================================
        // 19. ANTI-PROXY DETECTION
        // ========================================
        if (window.location.hostname.includes('proxy') || 
            window.location.hostname.includes('vpn')) {
            console.clear();
            window.location.href = 'about:blank';
        }

        // ========================================
        // 19. ADVANCED BEHAVIOR DETECTION
        // ========================================
        const accessLog = {
            requests: [],
            clicks: 0,
            scrolls: 0,
            startTime: Date.now()
        };

        // Monitorar padrão de cliques anormal
        document.addEventListener('click', () => {
            accessLog.clicks++;
        });

        // Monitorar padrão de scroll anormal
        window.addEventListener('scroll', () => {
            accessLog.scrolls++;
        });

        // Monitorar requisições HTTP anormais
        setInterval(() => {
            const elapsedTime = Date.now() - accessLog.startTime;
            const timeInSeconds = elapsedTime / 1000;

            // Se há mais de 50 cliques em menos de 5 segundos = suspeito
            if (accessLog.clicks > 50 && timeInSeconds < 5) {
                console.warn('Comportamento suspeito: cliques em excesso');
                window.location.reload();
            }

            // Se faz scroll constantemente = suspeito (web scraper)
            if (accessLog.scrolls > 100 && timeInSeconds < 10) {
                console.warn('Comportamento suspeito: scroll acelerado');
                window.location.reload();
            }

            // Reset
            if (timeInSeconds > 60) {
                accessLog.clicks = 0;
                accessLog.scrolls = 0;
                accessLog.startTime = Date.now();
            }
        }, 5000);

        // ========================================
        // 20. FINAL LOCKDOWN
        // ========================================
        Object.freeze(Object);
        Object.freeze(Object.prototype);

    })();

    // ========================================
    // PAGE LOADING ANIMATION
    // ========================================
    window.addEventListener('load', () => {
        const pageLoader = document.querySelector('.page-loader');
        if (pageLoader) {
            setTimeout(() => {
                pageLoader.classList.add('hide');
            }, 500);
        }
    });

    // Show loader on page start
    document.addEventListener('DOMContentLoaded', () => {
        // Improve performance
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                document.body.style.opacity = '1';
            });
        }
    });

    // ========================================
    // ENHANCED CARD INTERACTIONS - MINIMAL
    // ========================================
    document.querySelectorAll('[style*="background: linear-gradient"]').forEach(card => {
        card.classList.add('card-lift');
        // Mousemove tracking disabled for performance
    });

    // ========================================
    // BADGE PULSE ANIMATION
    // ========================================
    document.querySelectorAll('[class*="badge"], [class*="offer"]').forEach(badge => {
        badge.classList.add('badge-pulse');
    });

    // ========================================
    // ENHANCED BUTTON FEEDBACK
    // ========================================
    document.querySelectorAll('button, a[class*="btn"], [role="button"]').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });

        btn.addEventListener('mouseenter', function() {
            this.classList.add('btn-glow');
        });

        btn.addEventListener('mouseleave', function() {
            this.classList.remove('btn-glow');
        });
    });

    // ========================================
    // MOUSE TRACKING - DISABLED
    // ========================================
    // Mouse tracking disabled for better performance

    // ========================================
    // PARALLAX BACKGROUND ELEMENTS - DISABLED
    // ========================================
    // Parallax effect disabled for better mobile experience


    // ========================================
    // ENHANCED SCROLL ANIMATIONS - DISABLED
    // ========================================
    // Parallax on scroll disabled for better performance


    // ========================================
    // FOCUS & BLUR ANIMATIONS
    // ========================================
    document.addEventListener('focusin', (e) => {
        if (e.target.matches('input, textarea')) {
            e.target.parentElement?.classList.add('input-focused');
        }
    });

    document.addEventListener('focusout', (e) => {
        if (e.target.matches('input, textarea')) {
            e.target.parentElement?.classList.remove('input-focused');
        }
    });

    // ========================================
    // KEYBOARD NAVIGATION INDICATOR
    // ========================================
    let isNavigatingWithKeyboard = false;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            isNavigatingWithKeyboard = true;
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        isNavigatingWithKeyboard = false;
        document.body.classList.remove('keyboard-nav');
    });

    // ========================================
    // ELEMENT HOVER STATE MANAGER
    // ========================================
    document.querySelectorAll('button, a, [role="button"]').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
        });

        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        element.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
        });

        element.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // ========================================
    // VIEWPORT HEIGHT FIX FOR MOBILE
    // ========================================
    const setVH = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);

    // ========================================
    // PERFORMANCE OPTIMIZATION
    // ========================================
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Load non-critical features
            document.body.style.opacity = '1';
        });
    }

    // ========================================
    // SMOOTH ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });

    // ========================================
    // DYNAMIC PAGE PERFORMANCE MONITORING
    // ========================================
    if ('PerformanceObserver' in window) {
        try {
            const perfObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 3000) {
                        console.warn('Slow operation detected');
                    }
                }
            });
            perfObserver.observe({ entryTypes: ['measure'] });
        } catch (e) {}
    }

    // ========================================
    // NETWORK STATUS AWARENESS
    // ========================================
    if ('navigator' in window && 'connection' in navigator) {
        const updateConnectionStatus = () => {
            const connection = navigator.connection;
            if (connection.effectiveType === '4g') {
                document.body.classList.add('has-fast-connection');
            } else if (connection.effectiveType === '3g') {
                document.body.classList.add('has-slow-connection');
                // Reduce animations on slow connections
                document.querySelectorAll('[class*="animate"]').forEach(el => {
                    el.style.animationDuration = '0.5s';
                });
            }
        };

        updateConnectionStatus();
        navigator.connection.addEventListener('change', updateConnectionStatus);
    }

    // ========================================
    // ENHANCED PAGE VISIBILITY HANDLING
    // ========================================
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when tab is hidden
            document.body.style.animationPlayState = 'paused';
        } else {
            // Resume animations
            document.body.style.animationPlayState = 'running';
        }
    });

    // ========================================
    // DYNAMIC IMPORT FOR NON-CRITICAL FEATURES
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeNonCritical);
    } else {
        initializeNonCritical();
    }

    function initializeNonCritical() {
        // Initialize non-critical interactive features
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                // Load analytics
                // Load tracking
                // Load non-essential scripts
            });
        }
    }

    // ========================================
    // BATTERY STATUS OPTIMIZATION
    // ========================================
    if ('getBattery' in navigator) {
        navigator.getBattery?.().then(battery => {
            const optimizeBattery = () => {
                if (battery.level < 0.2) {
                    document.body.classList.add('low-battery');
                    // Reduce animations and effects
                }
            };

            optimizeBattery();
            battery.addEventListener('levelchange', optimizeBattery);
        }).catch(() => {});
    }

    // ========================================
    // GESTURE SUPPORT FOR MOBILE
    // ========================================
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right
        }
    }

    // ========================================
    // FINAL INITIALIZATION
    // ========================================
    window.addEventListener('load', () => {
        // Mark page as fully loaded
        document.documentElement.dataset.loaded = 'true';
        
        // Trigger final animations
        document.querySelectorAll('[data-animate]').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animated');
            }, index * 100);
        });
    });
    const countElements = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.getAttribute('data-count'));
                const duration = 2000;
                const start = Date.now();

                const animate = () => {
                    const progress = (Date.now() - start) / duration;
                    const current = Math.floor(target * progress);
                    element.textContent = current.toLocaleString();

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        element.textContent = target.toLocaleString();
                    }
                };

                animate();
                observer.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    countElements.forEach(el => observer.observe(el));

    // ========================================
    // PARALLAX SCROLL EFFECT - DISABLED
    // ========================================
    // Parallax effect disabled for smoother scrolling experience


    // ========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========================================
    // GRADIENT TEXT ANIMATION
    // ========================================
    document.querySelectorAll('[class*="bg-gradient"], [class*="gradient"]').forEach(el => {
        if (!el.classList.contains('gradient-animate')) {
            el.classList.add('gradient-animate');
        }
    });

    // ========================================
    // ENHANCED TOAST NOTIFICATIONS
    // ========================================
    const originalShowToast = window.showToast;
    window.showToast = function(message, type = 'success') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '10000';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: slideIn 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

        const iconSvg = type === 'success' 
            ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>'
            : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>';

        toast.innerHTML = iconSvg + `<span>${message}</span>`;
        container.appendChild(toast);

        const removeToast = () => {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        };

        setTimeout(removeToast, 3000);
    };

    // Add CSS for toast animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        }

        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .btn-glow {
            filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.4)) !important;
        }
    `;
    document.head.appendChild(style);
    class Confetti {
        constructor() {
            this.canvas = document.getElementById('confetti-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.resize();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        createConfetti(x, y) {
            const colors = ['#22d3ee', '#c084fc', '#f472b6', '#ffffff'];
            for (let i = 0; i < 50; i++) {
                this.particles.push({
                    x: x || window.innerWidth / 2,
                    y: y || window.innerHeight / 2,
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8 - 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 8 + 3,
                    life: 1
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.particles = this.particles.filter(p => p.life > 0);
            
            this.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2;
                p.life -= 0.015;
                
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.life;
                this.ctx.fillRect(p.x, p.y, p.size, p.size);
            });
            
            this.ctx.globalAlpha = 1;
            
            if (this.particles.length > 0) {
                requestAnimationFrame(() => this.animate());
            }
        }
    }

    const confetti = new Confetti();
    window.addEventListener('resize', () => confetti.resize());

    // ========================================
    // Toast NOTIFICATIONS (CSP-COMPLIANT)
    // ========================================
    function showToast(message, type = 'success') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconSvg = type === 'success' 
            ? '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
            : '<svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';

        toast.innerHTML = iconSvg + `<span>${message}</span>`;
        container.appendChild(toast);

        const removeToast = () => {
            toast.classList.add('toast-fade-out');
            setTimeout(() => toast.remove(), 300);
        };

        setTimeout(removeToast, 2500);
    }

// ========================================
// TOC MENU (Menu Retrátil com Setinha)
// ========================================
const tocMenu = document.getElementById('toc-menu');
const toggleBtn = document.getElementById('toggle-toc');
const setaToc = document.getElementById('seta-toc');

// Inicializar estados
if (tocMenu && setaToc) {
    tocMenu.classList.add('toc-closed');
    setaToc.classList.add('seta-normal');
}

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        // Toggle TOC menu visibility using classList (CSP-compliant)
        if (tocMenu.classList.contains('toc-closed')) {
            tocMenu.classList.remove('toc-closed');
            tocMenu.classList.add('toc-open');
            setaToc.classList.remove('seta-normal');
            setaToc.classList.add('seta-rotated');
        } else {
            tocMenu.classList.remove('toc-open');
            tocMenu.classList.add('toc-closed');
            setaToc.classList.remove('seta-rotated');
            setaToc.classList.add('seta-normal');
        }
    });
}

    const tocLinks = document.querySelectorAll('.toc-link');
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ========================================
    // TYPING EFFECT (Efeito de Digitação) COM GRADIENTE
    // ========================================
    function typeTextWithGradient(element, speed = 50) {
        const firstPart = "Construa um Negócio";
        const secondPart = "Lucrativo Online";
        
        let index = 0;
        element.innerHTML = '<br>';
        
        function typeFirstPart() {
            if (index < firstPart.length) {
                element.innerHTML = firstPart.substring(0, index + 1) + '<br>' + 
                    '<span class="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"></span>';
                index++;
                setTimeout(typeFirstPart, speed);
            } else {
                typeSecondPart();
            }
        }

        function typeSecondPart() {
            let index2 = 0;
            function type() {
                if (index2 < secondPart.length) {
                    element.innerHTML = firstPart + '<br>' + 
                        '<span class="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">' + 
                        secondPart.substring(0, index2 + 1) + '</span>';
                    index2++;
                    setTimeout(type, speed);
                }
            }
            type();
        }

        typeFirstPart();
    }

    // Aplicar ao headline
    const headline = document.querySelector('h1.text-5xl');
    if (headline) {
        typeTextWithGradient(headline, 30);
    }

    // ========================================
    // LAZY LOADING
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // CTA COM CONFETTI
    // ========================================
    const ctaButtons = document.querySelectorAll('a[href*="instagram"], button.btn-cta, a.btn-gradient');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            confetti.createConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
            confetti.animate();
            showToast('🎉 Redirecionando para conclusão da compra!', 'success');
        });
    });

    // ========================================
    // MICRO-INTERACTIONS APRIMORADAS (CSP-COMPLIANT)
    // ========================================
    document.querySelectorAll('button, a[class*="btn"], [role="button"]').forEach(elem => {
        elem.addEventListener('mouseenter', function() {
            this.classList.add('scale-on-hover');
        });
        
        elem.addEventListener('mouseleave', function() {
            this.classList.remove('scale-on-hover');
            this.classList.add('scale-on-hover-leave');
            setTimeout(() => {
                this.classList.remove('scale-on-hover-leave');
            }, 300);
        });
    });

    // ========================================
    // NEWSLETTER INLINE
    // ========================================
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            if (input && input.value) {
                showToast('✓ Email registrado com sucesso!', 'success');
                input.value = '';
            }
        });
    }

    // ========================================
    // READING TIME INDICATORS
    // ========================================
    function calculateReadingTime(text) {
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return minutes;
    }

    document.querySelectorAll('[data-reading-time]').forEach(section => {
        const text = section.innerText;
        const time = calculateReadingTime(text);
        const indicator = document.createElement('div');
        indicator.className = 'reading-time';
        indicator.textContent = `⏱️ Tempo de leitura: ${time} min`;
        section.insertBefore(indicator, section.firstChild);
    });

    // ========================================
    // FAQ ACCORDION (CSP-COMPLIANT)
    // ========================================
    document.querySelectorAll('.group').forEach(card => {
        card.addEventListener('click', () => {
            const resposta = card.querySelector('p, div.px-6.pb-5');
            if (resposta) {
                resposta.classList.toggle('faq-hidden');
                resposta.classList.toggle('faq-visible');
            }
        });
    });

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    // ========================================
    // COUNTDOWN TIMER
    // ========================================
    function initCountdownTimer() {
        const timerElement = document.getElementById('countdown-timer');
        const SESSION_KEY = 'countdownStart';
        let startTime = sessionStorage.getItem(SESSION_KEY);

        if (!startTime) {
            startTime = Date.now();
            sessionStorage.setItem(SESSION_KEY, startTime);
        } else {
            startTime = parseInt(startTime);
        }

        function updateCountdown() {
            const now = Date.now();
            const elapsed = now - startTime;
            const totalMs = 48 * 60 * 60 * 1000; // 48 horas em ms
            const remaining = Math.max(0, totalMs - elapsed);

            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

            if (timerElement) {
                timerElement.textContent = `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
            }

            if (remaining > 0) {
                setTimeout(updateCountdown, 1000);
            }
        }

        updateCountdown();
    }

    // ========================================
    // SCROLL-TO-TOP BUTTON
    // ========================================
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }

        // ========================================
        // SCROLL PROGRESS BAR
        // ========================================
        const scrollProgress = document.getElementById('scroll-progress');
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // AOS Initialization with delay to ensure library is loaded
    const initAOS = () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000, // Velocidade da animação (1 segundo)
                once: true,     // Anima apenas uma vez ao descer
            });
        } else {
            // Retry if AOS not yet loaded
            setTimeout(initAOS, 100);
        }
    };
    
    document.addEventListener('DOMContentLoaded', initAOS);
    // Also try immediately in case DOMContentLoaded already fired
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAOS);
    } else {
        initAOS();
    }

    // Initialize Countdown Timer
    initCountdownTimer();

    
