// ========================
// EXEMPLO DE BACKEND - Node.js + Express
// ========================
// Para rodar: npm install express cors body-parser
// Depois: node server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:8000', 'https://seusite.com'],
  credentials: true
}));
app.use(bodyParser.json());

// Logger
const log = (endpoint, data) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${endpoint}:`, data);
};

// ========================
// ENDPOINTS DE API
// ========================

// 1. Analytics
app.post('/api/analytics', (req, res) => {
  log('Analytics', req.body);
  
  // Salvar em arquivo ou banco de dados
  fs.appendFileSync('logs/analytics.json', JSON.stringify(req.body) + '\n');
  
  res.json({ status: 'ok', message: 'Analytics recorded' });
});

// 2. Live Chat
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  log('Chat', message);
  
  // Simular resposta de bot
  const replies = [
    'Obrigado pela sua mensagem! Um agente responderá em breve.',
    'Temos mais informações sobre isso. Deixe seu email para enviarmos!',
    'Essa é uma ótima pergunta. Posso ajudá-lo com mais detalhes?',
    'Como você soube do nosso site?'
  ];
  
  const reply = replies[Math.floor(Math.random() * replies.length)];
  
  res.json({ reply });
});

// 3. Newsletter Subscribe
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email, consent } = req.body;
  log('Newsletter Subscribe', email);
  
  // Salvar email
  const subscribers = fs.existsSync('data/subscribers.json')
    ? JSON.parse(fs.readFileSync('data/subscribers.json', 'utf8'))
    : [];
  
  subscribers.push({ email, consent, date: new Date() });
  fs.writeFileSync('data/subscribers.json', JSON.stringify(subscribers, null, 2));
  
  // Enviar email de boas-vindas
  sendEmail(email, 'Bem-vindo ao Master Digital Growth!', 
    'Obrigado por se inscrever. Você receberá dicas exclusivas em breve.');
  
  res.json({ status: 'ok', message: 'Subscribed' });
});

// 4. Criar Checkout Stripe
app.post('/api/create-checkout-session', (req, res) => {
  const { productId, email, amount } = req.body;
  log('Checkout Session', { productId, email });
  
  // Integrar com Stripe
  // const stripe = require('stripe')('sk_live_...');
  
  const session = {
    id: `sess_${Date.now()}`,
    url: 'https://checkout.stripe.com/...'
  };
  
  res.json(session);
});

// 5. Logs de Ataque
app.post('/api/log-attack', (req, res) => {
  const { type, details } = req.body;
  log('ATTACK DETECTED', { type, details, ip: req.ip });
  
  // Salvar em arquivo separado
  fs.appendFileSync('logs/attacks.json', JSON.stringify({
    type,
    details,
    ip: req.ip,
    timestamp: new Date()
  }) + '\n');
  
  // Enviar alerta ao admin
  sendAlert(`Attack detected: ${type}`, details);
  
  res.json({ status: 'logged' });
});

// 6. Chat Status
app.get('/api/chat/status', (req, res) => {
  res.json({ status: 'online' });
});

// 7. Orders
app.post('/api/orders', (req, res) => {
  const order = req.body;
  log('New Order', order);
  
  // Salvar em banco de dados
  const orders = fs.existsSync('data/orders.json')
    ? JSON.parse(fs.readFileSync('data/orders.json', 'utf8'))
    : [];
  
  orders.push(order);
  fs.writeFileSync('data/orders.json', JSON.stringify(orders, null, 2));
  
  // Enviar confirmação
  sendEmail(order.email, 'Pedido Confirmado!', 
    `Seu pedido ${order.orderId} foi recebido. Obrigado!`);
  
  res.json({ status: 'ok', orderId: order.orderId });
});

// 8. Email de Boas-vindas
app.post('/api/email/welcome', (req, res) => {
  const { email } = req.body;
  log('Welcome Email', email);
  
  sendEmail(email, 'Bem-vindo!', 'Conteúdo de boas-vindas...');
  
  res.json({ status: 'sent' });
});

// 9. Email de Confirmação de Pedido
app.post('/api/email/order-confirmation', (req, res) => {
  const { email, order } = req.body;
  log('Order Confirmation', email);
  
  sendEmail(email, 'Confirmação de Pedido', 
    `Pedido: ${order.orderId}\nValor: R$ ${(order.amount/100).toFixed(2)}`);
  
  res.json({ status: 'sent' });
});

// 10. Notificações de Newsletter
app.post('/api/newsletter/campaign', (req, res) => {
  const { recipients, subject, body } = req.body;
  log('Newsletter Campaign', { count: recipients.length });
  
  recipients.forEach(email => {
    sendEmail(email, subject, body);
  });
  
  res.json({ status: 'ok', sent: recipients.length });
});

// Helper: Enviar Email
function sendEmail(to, subject, body) {
  // Usar serviço como Sendinblue, Mailgun, AWS SES
  console.log(`📧 Email to ${to}: ${subject}`);
  
  // Exemplo com API (descomente com seu provider)
  // const axios = require('axios');
  // axios.post('https://api.sendinblue.com/v3/smtp/email', {...});
}

// Helper: Enviar Alerta
function sendAlert(title, message) {
  console.log(`🚨 ALERT: ${title}`);
  console.log(message);
  
  // Enviar para Slack, Discord, ou email do admin
  // fetch(SLACK_WEBHOOK, { method: 'POST', body: JSON.stringify(...) });
}

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server rodando em http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /api/analytics');
  console.log('  POST /api/chat');
  console.log('  POST /api/newsletter/subscribe');
  console.log('  POST /api/create-checkout-session');
  console.log('  POST /api/log-attack');
  console.log('  GET  /api/chat/status');
  console.log('  POST /api/orders');
  console.log('  POST /api/email/welcome');
  console.log('  POST /api/email/order-confirmation');
  console.log('  POST /api/newsletter/campaign');
  console.log('  GET  /health');
});

module.exports = app;
