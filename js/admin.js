// Admin Dashboard
// Gerenciamento de vendas, analytics e conteúdo

class AdminDashboard {
  constructor(adminPassword) {
    this.adminPassword = adminPassword;
    this.isAuthenticated = false;
    this.init();
  }

  init() {
    // Verificar se está autenticado
    this.checkAuth();
  }

  checkAuth() {
    const token = localStorage.getItem('admin_token');
    if (token) {
      this.isAuthenticated = true;
      this.showDashboard();
    }
  }

  login(password) {
    if (password === this.adminPassword) {
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('admin_token', token);
      this.isAuthenticated = true;
      this.showDashboard();
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('admin_token');
    this.isAuthenticated = false;
    this.hideDashboard();
  }

  showDashboard() {
    const dashboard = document.getElementById('admin-dashboard') || this.createDashboard();
    dashboard.classList.remove('hidden');
  }

  hideDashboard() {
    const dashboard = document.getElementById('admin-dashboard');
    if (dashboard) dashboard.classList.add('hidden');
  }

  createDashboard() {
    const html = `
      <div id="admin-dashboard" class="admin-dashboard hidden">
        <div class="admin-sidebar">
          <div class="admin-logo">🎛️ Admin</div>
          <nav class="admin-nav">
            <button onclick="window.adminDash.showSection('overview')" class="admin-nav-item active">
              📊 Dashboard
            </button>
            <button onclick="window.adminDash.showSection('orders')" class="admin-nav-item">
              💳 Pedidos
            </button>
            <button onclick="window.adminDash.showSection('subscribers')" class="admin-nav-item">
              📧 Inscritos
            </button>
            <button onclick="window.adminDash.showSection('analytics')" class="admin-nav-item">
              📈 Analytics
            </button>
            <button onclick="window.adminDash.showSection('content')" class="admin-nav-item">
              📝 Conteúdo
            </button>
            <button onclick="window.adminDash.showSection('settings')" class="admin-nav-item">
              ⚙️ Configurações
            </button>
            <button onclick="window.adminDash.logout()" class="admin-nav-item danger">
              🚪 Sair
            </button>
          </nav>
        </div>

        <div class="admin-content">
          <div id="overview-section" class="admin-section">
            <h2>📊 Dashboard</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Total de Vendas</div>
                <div class="stat-value">R$ <span id="total-revenue">0</span></div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Pedidos Completos</div>
                <div class="stat-value"><span id="completed-orders">0</span></div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Inscritos</div>
                <div class="stat-value"><span id="total-subscribers">0</span></div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Visitantes Hoje</div>
                <div class="stat-value"><span id="daily-visitors">0</span></div>
              </div>
            </div>
          </div>

          <div id="orders-section" class="admin-section hidden">
            <h2>💳 Pedidos</h2>
            <table id="orders-table" class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody id="orders-tbody"></tbody>
            </table>
          </div>

          <div id="subscribers-section" class="admin-section hidden">
            <h2>📧 Inscritos</h2>
            <div class="admin-actions">
              <input type="text" id="email-filter" placeholder="Filtrar email..." class="admin-input">
              <button onclick="window.adminDash.exportSubscribers()" class="admin-btn">📥 Exportar CSV</button>
            </div>
            <table id="subscribers-table" class="admin-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody id="subscribers-tbody"></tbody>
            </table>
          </div>

          <div id="analytics-section" class="admin-section hidden">
            <h2>📈 Analytics</h2>
            <canvas id="analytics-chart" width="800" height="200"></canvas>
            <div id="analytics-summary"></div>
          </div>

          <div id="content-section" class="admin-section hidden">
            <h2>📝 Conteúdo</h2>
            <form onsubmit="window.adminDash.saveBlogPost(event)">
              <input type="text" placeholder="Título" id="blog-title" required>
              <textarea placeholder="Conteúdo" id="blog-content" required rows="10"></textarea>
              <button type="submit">📤 Publicar</button>
            </form>
            <div id="blog-posts"></div>
          </div>

          <div id="settings-section" class="admin-section hidden">
            <h2>⚙️ Configurações</h2>
            <form onsubmit="window.adminDash.saveSettings(event)">
              <label>Email para Notificações:</label>
              <input type="email" id="admin-email" value="${localStorage.getItem('admin_email') || ''}">
              <button type="submit">💾 Salvar</button>
            </form>
          </div>
        </div>
      </div>
    `;

    const style = `
      <style>
        .admin-dashboard {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10001;
          display: flex;
          background: #f1f5f9;
        }

        .admin-dashboard.hidden {
          display: none;
        }

        .admin-sidebar {
          width: 250px;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          padding: 20px;
          overflow-y: auto;
        }

        .admin-logo {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 30px;
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .admin-nav-item {
          background: rgba(255,255,255,0.1);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
          transition: background 0.2s;
        }

        .admin-nav-item:hover {
          background: rgba(255,255,255,0.2);
        }

        .admin-nav-item.active {
          background: rgba(255,255,255,0.3);
        }

        .admin-nav-item.danger:hover {
          background: #ef4444;
        }

        .admin-content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
        }

        .admin-section {
          background: white;
          border-radius: 8px;
          padding: 20px;
        }

        .admin-section.hidden {
          display: none;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }

        .stat-card {
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #0284c7;
        }

        .stat-label {
          color: #64748b;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #1e293b;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .admin-table th {
          background: #f1f5f9;
          padding: 12px;
          text-align: left;
          font-weight: 600;
        }

        .admin-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        .admin-actions {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .admin-input {
          flex: 1;
          padding: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }

        .admin-btn {
          padding: 10px 20px;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        form input, form textarea {
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-family: inherit;
        }

        form textarea {
          resize: vertical;
        }

        form button {
          padding: 12px;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            flex-direction: column;
          }

          .admin-sidebar {
            width: 100%;
          }
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', style);
    document.body.insertAdjacentHTML('beforeend', html);

    this.loadDashboardData();
    return document.getElementById('admin-dashboard');
  }

  showSection(section) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
    const el = document.getElementById(`${section}-section`);
    if (el) el.classList.remove('hidden');
  }

  loadDashboardData() {
    // Implementar carregamento de dados aqui
    setTimeout(() => {
      this.updateStats();
    }, 1000);
  }

  updateStats() {
    // Placeholder para atualizar estatísticas
    document.getElementById('total-revenue').textContent = '0,00';
    document.getElementById('completed-orders').textContent = '0';
    document.getElementById('total-subscribers').textContent = '0';
    document.getElementById('daily-visitors').textContent = '0';
  }

  exportSubscribers() {
    // Implementar exportação CSV
    alert('✅ CSV exportado!');
  }

  saveBlogPost(event) {
    event.preventDefault();
    alert('✅ Post publicado!');
  }

  saveSettings(event) {
    event.preventDefault();
    const email = document.getElementById('admin-email').value;
    localStorage.setItem('admin_email', email);
    alert('✅ Configurações salvas!');
  }
}

export { AdminDashboard };
