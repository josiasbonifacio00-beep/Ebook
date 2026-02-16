// Analytics & Conversion Tracking
// Rastreia todas as interações e conversões

class AdvancedAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.events = [];
    this.pageViews = [];
    this.conversions = [];
    this.heatmapData = [];
    this.scrollDepth = 0;
    this.timeOnPage = 0;
    this.init();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  init() {
    this.trackPageView();
    this.trackScrollDepth();
    this.trackTimeOnPage();
    this.trackClicks();
    this.trackFormInteractions();
    this.setupBeaconOnUnload();
  }

  trackPageView() {
    this.pageViews.push({
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
      referrer: document.referrer,
      userAgent: navigator.userAgent
    });

    // Enviar para servidor
    this.send({
      type: 'pageview',
      data: this.pageViews[this.pageViews.length - 1]
    });
  }

  trackScrollDepth() {
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
        this.scrollDepth = maxScroll;

        if (maxScroll === 100) {
          this.trackEvent('scroll_depth', { depth: '100%', type: 'page_bottom' });
        } else if (maxScroll >= 75) {
          this.trackEvent('scroll_depth', { depth: '75%' });
        } else if (maxScroll >= 50) {
          this.trackEvent('scroll_depth', { depth: '50%' });
        }
      }
    }, { passive: true });
  }

  trackTimeOnPage() {
    setInterval(() => {
      this.timeOnPage = Math.round((Date.now() - this.startTime) / 1000);
    }, 10000); // Atualizar a cada 10s
  }

  trackClicks() {
    document.addEventListener('click', (e) => {
      const element = e.target.closest('[data-track], a, button');
      if (!element) return;

      this.trackEvent('click', {
        element: element.tagName,
        text: (element.textContent || element.value).substring(0, 50),
        href: element.href || 'N/A',
        id: element.id || 'N/A',
        class: element.className || 'N/A',
        coords: { x: e.clientX, y: e.clientY }
      });

      // Heatmap data
      this.heatmapData.push({
        x: e.clientX,
        y: e.clientY,
        type: 'click',
        timestamp: Date.now()
      });
    }, true);
  }

  trackFormInteractions() {
    document.querySelectorAll('form, input, textarea, select').forEach(el => {
      el.addEventListener('focus', () => {
        this.trackEvent('form_focus', {
          element: el.name || el.id,
          type: el.type
        });
      });

      el.addEventListener('blur', () => {
        this.trackEvent('form_blur', {
          element: el.name || el.id
        });
      });

      el.addEventListener('change', () => {
        this.trackEvent('form_change', {
          element: el.name || el.id,
          value: (el.value || '').substring(0, 50)
        });
      });
    });

    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        const formData = new FormData(e.target);
        this.trackConversion({
          type: 'form_submit',
          form_id: e.target.id,
          fields: Array.from(formData.keys()),
          timestamp: Date.now()
        });
      });
    });
  }

  trackEvent(eventName, data = {}) {
    this.events.push({
      name: eventName,
      data,
      timestamp: Date.now(),
      sessionId: this.sessionId
    });

    // Log no console em desenvolvimento
    if (localStorage.getItem('debug_analytics')) {
      console.log(`📊 Event: ${eventName}`, data);
    }
  }

  trackConversion(data) {
    const conversion = {
      ...data,
      sessionId: this.sessionId,
      timeOnPage: this.timeOnPage,
      scrollDepth: this.scrollDepth,
      timestamp: Date.now()
    };

    this.conversions.push(conversion);
    
    // Notificar servidor
    this.send({
      type: 'conversion',
      data: conversion
    });

    console.log('🎯 Conversion tracked:', conversion);
  }

  getHeatmapImage() {
    // Criar heatmap visual
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = document.documentElement.scrollHeight;
    const ctx = canvas.getContext('2d');

    this.heatmapData.forEach(point => {
      const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 30);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 30, 0, Math.PI * 2);
      ctx.fill();
    });

    return canvas.toDataURL();
  }

  getStats() {
    return {
      sessionId: this.sessionId,
      totalEvents: this.events.length,
      totalConversions: this.conversions.length,
      scrollDepth: Math.round(this.scrollDepth),
      timeOnPage: this.timeOnPage,
      pageViews: this.pageViews.length,
      heatmapPoints: this.heatmapData.length
    };
  }

  setupBeaconOnUnload() {
    window.addEventListener('beforeunload', () => {
      const data = {
        type: 'session_end',
        stats: this.getStats(),
        events: this.events.slice(-50) // Últimos 50 eventos
      };

      // Usar navigation.sendBeacon para evitar delay
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', JSON.stringify(data));
      } else {
        this.send(data);
      }
    });
  }

  send(data) {
    if (!navigator.sendBeacon) {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      }).catch(() => {
        // Falha silenciosa
      });
    }
  }

  exportData() {
    const csv = 'sessionId,type,data,timestamp\n' + 
      this.events.map(e => 
        `${e.sessionId},"${e.name}","${JSON.stringify(e.data).replace(/"/g, '""')}",${e.timestamp}`
      ).join('\n');
    
    return csv;
  }
}

export { AdvancedAnalytics };
