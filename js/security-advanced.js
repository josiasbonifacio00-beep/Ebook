// Rate Limiter & Geolocation
// Protege contra DDoS e restringe por país

class RateLimiter {
  constructor(maxRequests = 100, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.ips = {};
    this.geoblocked = ['KP', 'IR', 'SY']; // País bloqueados (Coreia do Norte, Irã, Síria)
  }

  check(ip) {
    const now = Date.now();
    
    if (!this.ips[ip]) {
      this.ips[ip] = { count: 1, resetTime: now + this.timeWindow };
      return true;
    }

    if (now > this.ips[ip].resetTime) {
      this.ips[ip] = { count: 1, resetTime: now + this.timeWindow };
      return true;
    }

    this.ips[ip].count++;
    
    if (this.ips[ip].count > this.maxRequests) {
      console.warn(`⚠️ Rate limit exceeded for IP: ${ip}`);
      return false;
    }

    return true;
  }

  isBlocked(countryCode) {
    return this.geoblocked.includes(countryCode);
  }

  addBlockedCountry(code) {
    if (!this.geoblocked.includes(code)) {
      this.geoblocked.push(code);
    }
  }

  getStats() {
    return {
      activeIPs: Object.keys(this.ips).length,
      totalAttempts: Object.values(this.ips).reduce((sum, ip) => sum + ip.count, 0),
      blockedCountries: this.geoblocked
    };
  }
}

class GeoLocationChecker {
  async getLocation() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Failed to get location');
      return await response.json();
    } catch (error) {
      console.error('Geolocation error:', error);
      return null;
    }
  }

  async checkAndBlock() {
    const location = await this.getLocation();
    if (!location) return;

    const blockedCountries = ['KP', 'IR', 'SY'];
    
    if (blockedCountries.includes(location.country_code)) {
      console.log('🚫 Access denied:', location.country_code);
      window.location.href = 'about:blank';
      return true;
    }

    localStorage.setItem('userLocation', JSON.stringify({
      country: location.country_code,
      city: location.city,
      ip: location.ip,
      timestamp: Date.now()
    }));

    return false;
  }
}

class CAPTCHAHandler {
  constructor() {
    this.failed_attempts = parseInt(localStorage.getItem('captcha_fails') || '0');
    this.max_failures = 3;
  }

  async show() {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'captcha-modal';
      modal.innerHTML = `
        <div class="captcha-container">
          <h3>🔒 Verificação de Segurança</h3>
          <p>Você está navegando de forma suspeita. Por favor, confirme que é humano.</p>
          <div class="captcha-challenge">
            <label>Qual é <strong id="num1">0</strong> + <strong id="num2">0</strong>?</label>
            <input type="number" id="captcha-input" placeholder="Sua resposta" autocomplete="off">
            <button onclick="window.captcha.verify()">Verificar</button>
          </div>
          <p class="captcha-note">Tentativa ${this.failed_attempts + 1} de ${this.max_failures}</p>
        </div>
      `;
      
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        backdrop-filter: blur(4px);
      `;

      document.body.appendChild(modal);

      // Randomizar números
      const num1 = Math.floor(Math.random() * 10);
      const num2 = Math.floor(Math.random() * 10);
      const correctAnswer = num1 + num2;

      document.getElementById('num1').textContent = num1;
      document.getElementById('num2').textContent = num2;

      window.captcha = {
        verify: () => {
          const answer = parseInt(document.getElementById('captcha-input').value);
          if (answer === correctAnswer) {
            this.recordSuccess();
            modal.remove();
            resolve(true);
          } else {
            this.recordFailure();
            if (this.failed_attempts >= this.max_failures) {
              window.location.href = 'about:blank';
            } else {
              document.getElementById('captcha-input').value = '';
              alert('❌ Resposta incorreta!');
            }
          }
        }
      };

      document.getElementById('captcha-input').focus();
      document.getElementById('captcha-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') window.captcha.verify();
      });
    });
  }

  recordSuccess() {
    localStorage.setItem('captcha_fails', '0');
    localStorage.setItem('captcha_verified', Date.now().toString());
  }

  recordFailure() {
    this.failed_attempts++;
    localStorage.setItem('captcha_fails', this.failed_attempts.toString());
    if (this.failed_attempts >= this.max_failures) {
      console.error('🚫 CAPTCHA failed too many times');
      fetch('/api/log-attack', {
        method: 'POST',
        body: JSON.stringify({
          type: 'CAPTCHA_FAILURE',
          timestamp: Date.now(),
          ip: 'unknown'
        })
      });
    }
  }

  isVerified() {
    const verified = localStorage.getItem('captcha_verified');
    if (!verified) return false;
    const age = Date.now() - parseInt(verified);
    return age < 3600000; // 1 hora
  }
}

export { RateLimiter, GeoLocationChecker, CAPTCHAHandler };
