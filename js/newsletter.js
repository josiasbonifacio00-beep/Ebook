// Newsletter & Email Capture
// Coleta de emails e automação

class NewsletterManager {
  constructor() {
    this.subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    this.init();
  }

  init() {
    this.createNewsletterPopup();
    this.setupFormHandlers();
    this.trackUnsub();
  }

  createNewsletterPopup() {
    if (this.hasSubscribed()) return;

    const html = `
      <div id="newsletter-popup" class="newsletter-popup hidden">
        <div class="newsletter-content">
          <button class="close-popup" onclick="window.newsletter.closePopup()">✕</button>
          
          <div class="newsletter-text">
            <h2>🎁 Ganhe Acesso Exclusivo!</h2>
            <p>Receba dicas de crescimento digital direto no seu email</p>
          </div>

          <form id="newsletter-form" onsubmit="window.newsletter.subscribe(event)">
            <input type="email" placeholder="seu@email.com" required>
            <button type="submit">Enviar</button>
          </form>

          <label class="newsletter-checkbox">
            <input type="checkbox" checked> Aceito receber emails de marketing
          </label>
        </div>
      </div>

      <style>
        .newsletter-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(4px);
        }

        .newsletter-popup.hidden {
          display: none;
        }

        .newsletter-content {
          background: white;
          border-radius: 16px;
          padding: 40px;
          max-width: 500px;
          width: 90%;
          position: relative;
          animation: slideIn 0.3s ease;
        }

        .close-popup {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #94a3b8;
        }

        .newsletter-text h2 {
          margin: 0 0 10px;
          color: #1e293b;
          font-size: 24px;
        }

        .newsletter-text p {
          margin: 0 0 20px;
          color: #64748b;
          font-size: 14px;
        }

        #newsletter-form {
          display: flex;
          gap: 8px;
          margin-bottom: 15px;
        }

        #newsletter-form input {
          flex: 1;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
        }

        #newsletter-form input:focus {
          outline: none;
          border-color: #1e293b;
        }

        #newsletter-form button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: transform 0.2s;
        }

        #newsletter-form button:hover {
          transform: scale(1.02);
        }

        .newsletter-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          cursor: pointer;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      </style>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    // Mostrar popup após 10 segundos ou 50% scroll
    setTimeout(() => this.showPopup(), 10000);
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 50) {
        this.showPopup();
      }
    }, { once: true });
  }

  showPopup() {
    const popup = document.getElementById('newsletter-popup');
    if (popup && !this.hasSubscribed()) {
      popup.classList.remove('hidden');
    }
  }

  closePopup() {
    const popup = document.getElementById('newsletter-popup');
    if (popup) {
      popup.classList.add('hidden');
      localStorage.setItem('newsletter_dismissed', Date.now().toString());
    }
  }

  subscribe(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const consent = form.querySelector('input[type="checkbox"]').checked;

    const subscriber = {
      email,
      consent,
      subscribeDate: Date.now(),
      source: window.location.href,
      status: 'active'
    };

    this.subscribers.push(subscriber);
    localStorage.setItem('subscribers', JSON.stringify(this.subscribers));

    // Enviar para servidor
    fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriber)
    }).catch(() => {});

    // Confirmar
    alert('✅ Bem-vindo ao nosso newsletter!');
    this.closePopup();

    // Enviar email de boas-vindas
    this.sendWelcomeEmail(email);
  }

  sendWelcomeEmail(email) {
    fetch('/api/email/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, timestamp: Date.now() })
    }).catch(() => {});
  }

  hasSubscribed() {
    return localStorage.getItem('newsletter_subscribed') !== null;
  }

  trackUnsub() {
    // Rastrear links de unsubscribe
    document.addEventListener('click', (e) => {
      if (e.target.href && e.target.href.includes('unsubscribe')) {
        const email = this.getEmailFromURL(e.target.href);
        if (email) {
          this.unsubscribe(email);
        }
      }
    });
  }

  unsubscribe(email) {
    this.subscribers = this.subscribers.filter(s => s.email !== email);
    localStorage.setItem('subscribers', JSON.stringify(this.subscribers));
    
    fetch('/api/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email })
    }).catch(() => {});
  }

  getEmailFromURL(url) {
    const match = url.match(/email=([^&]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  getSubscriberCount() {
    return this.subscribers.length;
  }

  sendCampaign(campaignData) {
    const emails = this.subscribers
      .filter(s => s.status === 'active' && s.consent)
      .map(s => s.email);

    fetch('/api/newsletter/campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...campaignData,
        recipients: emails,
        sentAt: Date.now()
      })
    }).catch(() => {});

    return `Campaign sent to ${emails.length} subscribers`;
  }
}

export { NewsletterManager };
