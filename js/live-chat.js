// Live Chat Widget
// Suporte em tempo real

class LiveChat {
  constructor() {
    this.messages = [];
    this.isOpen = false;
    this.isOnline = true;
    this.checkServerStatus();
    this.init();
  }

  init() {
    this.createWidget();
    this.attachEvents();
  }

  createWidget() {
    const html = `
      <div id="live-chat-widget" class="live-chat-widget">
        <div class="chat-header" onclick="window.liveChat.toggle()">
          <div class="chat-status">
            <span class="status-indicator ${this.isOnline ? 'online' : 'offline'}"></span>
            <span class="status-text">Support Team</span>
          </div>
          <button class="chat-minimize">−</button>
        </div>
        
        <div class="chat-body hidden">
          <div class="messages-container" id="chat-messages">
            <div class="message bot">
              <p>👋 Olá! Como podemos ajudar?</p>
            </div>
          </div>
          
          <div class="chat-input-area">
            <input type="text" id="chat-input" placeholder="Digite sua mensagem..." autocomplete="off">
            <button onclick="window.liveChat.send()" class="send-btn">→</button>
          </div>
        </div>
      </div>
    `;

    const style = `
      <style>
        .live-chat-widget {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 350px;
          border-radius: 12px;
          box-shadow: 0 5px 40px rgba(0,0,0,0.2);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          z-index: 9999;
          background: white;
          max-width: 90vw;
          overflow: hidden;
        }

        .chat-header {
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }

        .chat-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-indicator.online {
          background: #10b981;
        }

        .status-indicator.offline {
          background: #ef4444;
          animation: none;
        }

        .chat-minimize {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
        }

        .chat-body {
          display: flex;
          flex-direction: column;
          height: 400px;
          background: #f8fafc;
        }

        .chat-body.hidden {
          display: none;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .message {
          display: flex;
          max-width: 80%;
          padding: 10px 15px;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .message.bot {
          align-self: flex-start;
          background: white;
          color: #1e293b;
          border: 1px solid #e2e8f0;
        }

        .message.user {
          align-self: flex-end;
          background: #1e293b;
          color: white;
        }

        .chat-input-area {
          display: flex;
          gap: 8px;
          padding: 12px;
          border-top: 1px solid #e2e8f0;
          background: white;
        }

        #chat-input {
          flex: 1;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 14px;
          outline: none;
        }

        #chat-input:focus {
          border-color: #1e293b;
        }

        .send-btn {
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          cursor: pointer;
          font-size: 18px;
          transition: background 0.2s;
        }

        .send-btn:hover {
          background: #0f172a;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        @media (max-width: 480px) {
          .live-chat-widget {
            width: calc(100vw - 20px);
            height: 90vh;
            bottom: 10px;
            right: 10px;
          }

          .chat-body {
            height: auto;
            flex: 1;
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', style);
    document.body.insertAdjacentHTML('beforeend', html);
  }

  attachEvents() {
    const input = document.getElementById('chat-input');
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.send();
        }
      });
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const body = document.querySelector('.live-chat-widget .chat-body');
    if (body) {
      body.classList.toggle('hidden');
    }
  }

  send() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;

    const message = input.value.trim();
    this.addMessage('user', message);
    input.value = '';

    // Enviar para servidor
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, timestamp: Date.now() })
    })
    .then(r => r.json())
    .then(data => {
      setTimeout(() => {
        this.addMessage('bot', data.reply || '👤 Recebemos sua mensagem. Entraremos em contato em breve!');
      }, 500);
    })
    .catch(() => {
      this.addMessage('bot', 'Desculpe, estou offline no momento. Enviaremos uma resposta em breve!');
    });
  }

  addMessage(sender, text) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msgEl = document.createElement('div');
    msgEl.className = `message ${sender}`;
    msgEl.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
    container.appendChild(msgEl);
    container.scrollTop = container.scrollHeight;

    this.messages.push({ sender, text, timestamp: Date.now() });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  checkServerStatus() {
    setInterval(() => {
      fetch('/api/chat/status')
        .then(r => r.ok ? (this.isOnline = true) : (this.isOnline = false))
        .catch(() => this.isOnline = false);
    }, 30000);
  }

  getHistory() {
    return this.messages;
  }
}

export { LiveChat };
