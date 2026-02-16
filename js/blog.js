// Blog Engine
// Sistema de blog completo com categorias e busca

class BlogEngine {
  constructor() {
    this.posts = JSON.parse(localStorage.getItem('blog_posts') || '[]');
    this.categories = ['Digital Growth', 'Marketing', 'Tecnologia', 'Dicas', 'Casos de Sucesso'];
    this.init();
  }

  init() {
    this.renderBlogListings();
    this.setupSearch();
    this.setupCategoryFilter();
  }

  createPost(title, content, category, excerpt = '', featured = false) {
    const post = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      content,
      excerpt: excerpt || content.substring(0, 150),
      category,
      featured,
      author: 'Master Digital Growth',
      publishedAt: Date.now(),
      updatedAt: Date.now(),
      views: 0,
      likes: 0,
      comments: []
    };

    this.posts.unshift(post);
    this.savePosts();
    return post;
  }

  savePosts() {
    localStorage.setItem('blog_posts', JSON.stringify(this.posts));
  }

  getPostByUrl(slug) {
    // Encontrar post por slug
    return this.posts.find(p => this.slugify(p.title) === slug);
  }

  slugify(text) {
    return text.toLowerCase().replace(/[^\w]+/g, '-');
  }

  renderBlogListings() {
    const container = document.getElementById('blog-container');
    if (!container) return;

    // Post destacado
    const featured = this.posts.filter(p => p.featured)[0];
    if (featured) {
      container.innerHTML += this.renderFeaturedPost(featured);
    }

    // Posts recentes
    const postsHtml = this.posts.slice(0, 9).map(post => this.renderPostCard(post)).join('');
    container.innerHTML += `<div class="blog-grid">${postsHtml}</div>`;
  }

  renderFeaturedPost(post) {
    return `
      <div class="blog-featured">
        <div class="blog-featured-content">
          <span class="blog-category">${post.category}</span>
          <h2>${post.title}</h2>
          <p>${post.excerpt}</p>
          <a href="/blog/${this.slugify(post.title)}" class="btn-read-more">
            Ler Mais →
          </a>
        </div>
      </div>
    `;
  }

  renderPostCard(post) {
    return `
      <article class="blog-card">
        <div class="blog-card-header">
          <span class="blog-category">${post.category}</span>
          <span class="blog-date">${this.formatDate(post.publishedAt)}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <div class="blog-card-footer">
          <a href="/blog/${this.slugify(post.title)}" class="blog-read-more">
            Ler artigo →
          </a>
          <span class="blog-stats">
            👁️ ${post.views} | ❤️ ${post.likes}
          </span>
        </div>
      </article>
    `;
  }

  renderFullPost(post) {
    post.views++;
    this.savePosts();

    return `
      <article class="blog-post-full">
        <header class="blog-post-header">
          <h1>${post.title}</h1>
          <div class="blog-post-meta">
            <span>${post.author}</span>
            <span>•</span>
            <span>${this.formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span>${this.readingTime(post.content)} min leitura</span>
          </div>
        </header>

        <div class="blog-post-content">
          ${this.parseMarkdown(post.content)}
        </div>

        <footer class="blog-post-footer">
          <div class="blog-post-actions">
            <button onclick="window.blog.likePost('${post.id}')" class="btn-like">
              ❤️ ${post.likes}
            </button>
            <button onclick="window.blog.sharePost('${post.id}')" class="btn-share">
              📤 Compartilhar
            </button>
          </div>

          <div class="blog-comments">
            <h3>Comentários (${post.comments.length})</h3>
            <form onsubmit="window.blog.addComment('${post.id}', event)">
              <input type="text" placeholder="Seu nome" required>
              <textarea placeholder="Seu comentário..." required rows="3"></textarea>
              <button type="submit">Comentar</button>
            </form>
            ${post.comments.map(c => `
              <div class="comment">
                <strong>${c.author}</strong>
                <small>${this.formatDate(c.date)}</small>
                <p>${c.text}</p>
              </div>
            `).join('')}
          </div>
        </footer>
      </article>
    `;
  }

  parseMarkdown(content) {
    // Conversão simples de markdown para HTML
    let html = content
      .replace(/^# (.*?)$/gim, '<h1>$1</h1>')
      .replace(/^## (.*?)$/gim, '<h2>$1</h2>')
      .replace(/^### (.*?)$/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^- (.*?)$/gim, '<li>$1</li>')
      .replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/^(.*?)$/gim, '<p>$1</p>')
      .replace(/<p><\/p>/gim, '');

    return html;
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  readingTime(content) {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 200); // 200 palavras por minuto
  }

  likePost(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (post) {
      post.likes++;
      this.savePosts();
      console.log('❤️ Post liked!');
    }
  }

  sharePost(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const text = `Confira este artigo: ${post.title}`;
    const url = `${window.location.origin}/blog/${this.slugify(post.title)}`;

    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: url
      });
    } else {
      alert(`Compartilhe: ${url}`);
    }
  }

  addComment(postId, event) {
    event.preventDefault();
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const author = event.target[0].value;
    const text = event.target[1].value;

    post.comments.push({
      author,
      text,
      date: Date.now()
    });

    this.savePosts();
    event.target.reset();
    alert('✅ Comentário adicionado!');
  }

  setupSearch() {
    const searchInput = document.getElementById('blog-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = this.posts.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query)
      );

      this.renderSearchResults(filtered);
    });
  }

  renderSearchResults(results) {
    const container = document.getElementById('blog-results');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = '<p>Nenhum artigo encontrado</p>';
      return;
    }

    container.innerHTML = results.map(post => this.renderPostCard(post)).join('');
  }

  setupCategoryFilter() {
    const buttons = document.querySelectorAll('[data-category]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        const filtered = this.posts.filter(p => p.category === category);
        this.renderSearchResults(filtered);
      });
    });
  }

  getStats() {
    return {
      totalPosts: this.posts.length,
      totalViews: this.posts.reduce((sum, p) => sum + p.views, 0),
      totalLikes: this.posts.reduce((sum, p) => sum + p.likes, 0),
      averageReadTime: Math.round(this.posts.reduce((sum, p) => sum + this.readingTime(p.content), 0) / this.posts.length)
    };
  }
}

export { BlogEngine };
