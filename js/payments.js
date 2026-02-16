// Payment Integration
// Stripe & PayPal

class PaymentHandler {
  constructor(config = {}) {
    this.stripeKey = config.stripeKey || '';
    this.paypalClientId = config.paypalClientId || '';
    this.products = config.products || [];
    this.orders = JSON.parse(localStorage.getItem('orders') || '[]');
    this.init();
  }

  init() {
    this.loadStripe();
    this.loadPayPal();
  }

  loadStripe() {
    if (!this.stripeKey) return;
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    document.head.appendChild(script);
  }

  loadPayPal() {
    if (!this.paypalClientId) return;
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${this.paypalClientId}`;
    document.head.appendChild(script);
  }

  async createCheckout(productId, email) {
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      alert('❌ Produto não encontrado');
      return;
    }

    const order = {
      orderId: this.generateOrderId(),
      productId,
      email,
      amount: product.price,
      currency: 'BRL',
      createdAt: Date.now(),
      status: 'pending'
    };

    // Tentar Stripe
    if (this.stripeKey && window.Stripe) {
      return this.createStripeCheckout(order);
    }

    // Fallback PayPal
    if (this.paypalClientId && window.paypal) {
      return this.createPayPalCheckout(order);
    }

    alert('❌ Nenhum gateway de pagamento configurado');
  }

  async createStripeCheckout(order) {
    const stripe = window.Stripe(this.stripeKey);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });

      const session = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        alert('❌ Erro no pagamento: ' + result.error.message);
      }

      return result;
    } catch (error) {
      console.error('Stripe error:', error);
      alert('❌ Erro ao processar pagamento');
    }
  }

  async createPayPalCheckout(order) {
    if (!window.paypal) {
      alert('PayPal ainda carregando...');
      return;
    }

    window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: (order.amount / 100).toString() // Converter de centavos
            }
          }],
          payer: {
            email_address: order.email
          }
        });
      },

      onApprove: async (data, actions) => {
        const details = await actions.order.capture();
        this.recordOrder({
          ...order,
          paymentId: details.id,
          paymentMethod: 'paypal',
          status: 'completed'
        });
        alert('✅ Pagamento aprovado!');
        this.sendOrderConfirmation(order.email, order);
      },

      onError: (err) => {
        console.error('PayPal error:', err);
        alert('❌ Erro ao processar pagamento');
      }
    }).render('#paypal-button-container');
  }

  recordOrder(order) {
    this.orders.push(order);
    localStorage.setItem('orders', JSON.stringify(this.orders));

    // Enviar para servidor
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    }).catch(() => {});
  }

  sendOrderConfirmation(email, order) {
    fetch('/api/email/order-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, order })
    }).catch(() => {});
  }

  generateOrderId() {
    return `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getOrders(email) {
    return this.orders.filter(o => o.email === email);
  }

  getOrderStats() {
    const completed = this.orders.filter(o => o.status === 'completed');
    const totalRevenue = completed.reduce((sum, o) => sum + o.amount, 0);

    return {
      totalOrders: this.orders.length,
      completedOrders: completed.length,
      pendingOrders: this.orders.filter(o => o.status === 'pending').length,
      canceledOrders: this.orders.filter(o => o.status === 'canceled').length,
      totalRevenue,
      averageOrderValue: completed.length > 0 ? totalRevenue / completed.length : 0
    };
  }
}

export { PaymentHandler };
