// Utilities - Dark Mode, Countdown, Testimonials, etc
// Funcionalidades diversas

class DarkModeToggle {
  constructor() {
    this.isDark = localStorage.getItem('darkMode') === 'true';
    this.init();
  }

  init() {
    if (this.isDark) {
      this.enable();
    }
    this.createToggle();
  }

  createToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'dark-mode-toggle';
    toggle.innerHTML = this.isDark ? '☀️' : '🌙';
    toggle.onclick = () => this.toggle();
    document.body.appendChild(toggle);

    const style = `
      <style>
        .dark-mode-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--toggle-bg);
          border: none;
          font-size: 24px;
          cursor: pointer;
          z-index: 1000;
          transition: all 0.3s;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .dark-mode-toggle:hover {
          transform: scale(1.1);
        }

        body {
          --bg-color: #ffffff;
          --text-color: #1e293b;
          --border-color: #e2e8f0;
          --card-bg: #f8fafc;
          --toggle-bg: #f1f5f9;
        }

        body.dark-mode {
          --bg-color: #0f172a;
          --text-color: #e2e8f0;
          --border-color: #334155;
          --card-bg: #1e293b;
          --toggle-bg: #1e293b;
        }

        body, body.dark-mode {
          background: var(--bg-color);
          color: var(--text-color);
          transition: background 0.3s, color 0.3s;
        }
      </style>
    `;
    document.head.insertAdjacentHTML('beforeend', style);
  }

  toggle() {
    this.isDark ? this.disable() : this.enable();
  }

  enable() {
    this.isDark = true;
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
    document.querySelector('.dark-mode-toggle').innerHTML = '☀️';
  }

  disable() {
    this.isDark = false;
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'false');
    document.querySelector('.dark-mode-toggle').innerHTML = '🌙';
  }
}

class CountdownTimer {
  constructor(targetDate) {
    this.targetDate = new Date(targetDate).getTime();
    this.interval = null;
  }

  render(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = this.targetDate - now;

      if (distance < 0) {
        element.innerHTML = '<span class="countdown-expired">⏰ Oferta Expirada</span>';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      element.innerHTML = `
        <div class="countdown">
          <div class="countdown-item">
            <span class="countdown-number">${days}</span>
            <span class="countdown-label">Dias</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">${hours}</span>
            <span class="countdown-label">Horas</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">${minutes}</span>
            <span class="countdown-label">Min</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">${seconds}</span>
            <span class="countdown-label">Seg</span>
          </div>
        </div>
      `;
    };

    updateCountdown();
    this.interval = setInterval(updateCountdown, 1000);
  }

  destroy() {
    if (this.interval) clearInterval(this.interval);
  }
}

class DynamicTestimonials {
  constructor(testimonials = []) {
    this.testimonials = testimonials;
    this.currentIndex = 0;
    this.autoPlayInterval = null;
  }

  render(elementId, autoPlay = true) {
    const element = document.getElementById(elementId);
    if (!element || this.testimonials.length === 0) return;

    const style = `
      <style>
        .testimonials-container {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 30px;
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border-radius: 12px;
          min-height: 200px;
        }

        .testimonial-slide {
          flex: 1;
          animation: slideIn 0.5s ease;
        }

        .testimonial-quote {
          font-size: 18px;
          font-style: italic;
          margin-bottom: 15px;
          color: #1e293b;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .testimonial-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .testimonial-info h4 {
          margin: 0;
          color: #1e293b;
        }

        .testimonial-info small {
          color: #64748b;
        }

        .testimonials-nav {
          display: flex;
          gap: 10px;
        }

        .testimonials-btn {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.2s;
        }

        .testimonials-btn:hover {
          background: #1e293b;
          color: white;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      </style>
    `;
    document.head.insertAdjacentHTML('beforeend', style);

    const renderSlide = () => {
      const testimonial = this.testimonials[this.currentIndex];
      element.innerHTML = `
        <div class="testimonials-container">
          <div class="testimonial-slide">
            <p class="testimonial-quote">"${testimonial.quote}"</p>
            <div class="testimonial-author">
              <div class="testimonial-avatar">${testimonial.name.charAt(0)}</div>
              <div class="testimonial-info">
                <h4>${testimonial.name}</h4>
                <small>${testimonial.role}</small>
              </div>
            </div>
          </div>
          <div class="testimonials-nav">
            <button class="testimonials-btn" onclick="window.testimonials.prev()">←</button>
            <button class="testimonials-btn" onclick="window.testimonials.next()">→</button>
          </div>
        </div>
      `;
    };

    renderSlide();

    if (autoPlay) {
      this.autoPlayInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        renderSlide();
      }, 5000);
    }

    window.testimonials = {
      next: () => {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
        renderSlide();
      },
      prev: () => {
        this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
        renderSlide();
      }
    };
  }
}

class DiscountPopup {
  constructor(discount = 30, message = '🎁 Ganhe 30% OFF!') {
    this.discount = discount;
    this.message = message;
    this.shown = false;
  }

  show() {
    if (this.shown || localStorage.getItem('discount_popup_shown')) return;

    const html = `
      <div id="discount-popup" class="discount-popup">
        <div class="discount-content">
          <button onclick="document.getElementById('discount-popup').remove()" class="close-discount">✕</button>
          <h2>${this.message}</h2>
          <p>Use o código: <code>DIGITAL${this.discount}</code></p>
          <button onclick="navigator.clipboard.writeText('DIGITAL${this.discount}'); alert('✅ Código copiado!');">
            📋 Copiar Código
          </button>
        </div>
      </div>

      <style>
        .discount-popup {
          position: fixed;
          bottom: 20px;
          left: 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          max-width: 300px;
          z-index: 9998;
          animation: slideUp 0.5s ease;
        }

        .discount-content {
          position: relative;
        }

        .close-discount {
          position: absolute;
          top: -25px;
          right: 0;
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
        }

        .discount-popup h2 {
          margin: 0 0 10px;
          font-size: 20px;
        }

        .discount-popup code {
          background: rgba(0,0,0,0.2);
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
        }

        .discount-popup button {
          background: white;
          color: #10b981;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 10px;
          width: 100%;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    this.shown = true;
    localStorage.setItem('discount_popup_shown', Date.now().toString());
  }
}

export { DarkModeToggle, CountdownTimer, DynamicTestimonials, DiscountPopup };
