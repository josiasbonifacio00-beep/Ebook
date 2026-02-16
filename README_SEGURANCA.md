# 🔒 Documentação de Segurança - Master Digital Growth

## 📋 Resumo Executivo

Seu site foi configurado com **20+ camadas de proteção** contra scraping, extensions de Chrome, e acesso não autorizado. As proteções funcionam em **3 níveis**:

1. **Cliente (JavaScript)** - Detecção e bloqueio em tempo real
2. **Servidor (.htaccess ou nginx.conf)** - Filtragem de requisições
3. **Protocolo (robots.txt)** - Políticas de rastreamento

---

## 🛡️ Proteções Implementadas

### ✅ Nível JavaScript (Cliente)

#### 1. Detecção de DevTools
- Monitora abertura de console/DevTools
- Bloqueia ações F12, Ctrl+Shift+I/J/K, Ctrl+U
- Injeta `debugger` continuamente para forçar pause

#### 2. Bloqueio de Extensões Chrome
- Detecta uso de `chrome.runtime.getManifest()`
- Verifica `browser` e APIs de extensão
- Bloqueia automaticamente se detectado

#### 3. Detecção de Scrapers
Bloqueia automaticamente os seguintes User-Agents:
- **Downloaders**: HTTrack, WebCopier, Teleport, Offline Explorer
- **Command-line**: wget, curl
- **Python**: urllib, requests, BeautifulSoup, Scrapy
- **Linguagens**: Java HTTP clients, Ruby, Node.js bots
- **Ferramentas**: Mata, Zeus, Turnittin, Copyscape

**Total: 45+ padrões detectados**

#### 4. Monitoramento de Rede
- Intercepta todas as requisições `Fetch` e `XMLHttpRequest`
- Bloqueia requisições suspeitas
- Valida origem das requisições

#### 5. Detecção de Comportamento Anômalo
- Monitora cliques (limite: 50 em <5s dispara reload)
- Monitora scrolls (limite: 100 em <10s dispara reload)
- Padrões de navegação humana vs. robô

#### 6. Proteções Gerais
- ❌ Copy/Paste desabilitado
- ❌ Drag & Drop desabilitado
- ❌ Clique direito desabilitado
- ❌ Seleção de texto desabilitado
- ❌ Console.clear() a cada 100ms
- ❌ Worker/SharedArrayBuffer bloqueados

### ✅ Nível Servidor (.htaccess - Apache)

```apache
# Bloqueio por User-Agent
SetEnvIf User-Agent "HTTrack|wget|curl" deny_access

# Desabilitar PUT/DELETE
<Limit PUT DELETE>
    deny from all
</Limit>

# Proteger arquivos sensíveis
<FilesMatch "\.(ht|git|env|ini|sql|conf|log)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Cache headers obrigatório
<IfModule mod_headers.c>
    Header set Cache-Control "no-cache, no-store, must-revalidate"
</IfModule>
```

**Para Nginx**, use o arquivo `nginx.conf.example` fornecido.

### ✅ Nível Protocolo (robots.txt)

```
User-agent: HTTrack
Disallow: /

User-agent: wget
Disallow: /

User-agent: curl
Disallow: /

# Permitir bots legítimos com delay
User-agent: Googlebot
Disallow: 
Crawl-delay: 1

User-agent: Bingbot
Disallow:
Crawl-delay: 1
```

---

## 🚀 Como Usar

### 1️⃣ Se usar **Apache** (.htaccess):
- ✅ Arquivo `.htaccess` já está configurado
- Coloque na raiz do seu site
- Reinicie o servidor Apache

### 2️⃣ Se usar **Nginx**:
- 📄 Use o arquivo `nginx.conf.example`
- Copie as configurações para seu bloco `server`
- Teste: `nginx -t`
- Reinicie: `systemctl restart nginx`

### 3️⃣ Ambos (Apache/Nginx):
- ✅ `robots.txt` já está configurado
- ✅ `js/script.js` contém todas as proteções JavaScript
- ✅ Meta tags de segurança em `index.html`

---

## 🧪 Como Testar

### Teste 1: DevTools
```javascript
// Alguém tenta:
- Pressionar F12
- Ctrl+Shift+I
- Ctrl+Shift+J
- Ctrl+U
// Resultado: ❌ Bloqueado
```

### Teste 2: Scraper
```bash
# Alguém tenta:
wget https://seusite.com
curl https://seusite.com
httrack https://seusite.com
# Resultado: ❌ 403 Forbidden
```

### Teste 3: Chrome Extension
```javascript
// Uma extension tenta acessar:
chrome.runtime.getManifest()
// Resultado: ❌ Página recarrega
```

### Teste 4: Comportamento Suspeito
```javascript
// Alguém clicar 51x em <5 segundos
// Resultado: ❌ Página recarrega
```

---

## ⚙️ Configurações Personalizáveis

Se precisar ajustar limites, edite `js/script.js`:

```javascript
// Linha ~530: Ajustar limite de cliques
if (accessLog.clicks > 50) {  // ← Mudar este número

// Linha ~540: Ajustar intervalo de tempo
if (timeInSeconds < 5) {  // ← Mudar de 5s para outro valor

// Linha ~530: Ajustar limite de scrolls
if (accessLog.scrolls > 100) {  // ← Mudar este número
```

---

## ⚠️ Possíveis Impactos

### Usuários Legítimos
✅ **Não afetados** - Comportamento humano normal não dispara proteções

### Ferramentas Legítimas
Podem ser bloqueadas se usarem User-Agents conhecidos:
- Lighthouse
- GTmetrix
- WebPageTest
- Algumas ferramentas de acessibilidade

**Solução**: Adicione à whitelist em `js/script.js`

### Desempenho
✅ **Mínimo impacto** - Proteções rodam em background

---

## 📊 Métricas de Bloqueio

O site está bloqueando automaticamente:

| Categoria | Bloqueados | Método |
|-----------|-----------|--------|
| User-Agents | 45+ | JavaScript + .htaccess |
| Métodos HTTP | PUT, DELETE | .htaccess |
| Extensões Chrome | ∞ | JavaScript |
| Comportamento Anômalo | ∞ | JavaScript |
| Hotlinking | ✅ | nginx.conf |
| Diretórios | ✅ | .htaccess |

---

## 🔐 Segurança HTTP Headers

Seu site envia automaticamente:

```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
```

---

## 🚨 Emergências / Troubleshooting

### ❌ "Meu site não abre"
- [ ] Verificar se `.htaccess` está bem configurado
- [ ] Testar com `curl http://localhost/` (sem User-Agent fake)
- [ ] Verificar se `mod_rewrite` está ativado (Apache)

### ❌ "Estou bloqueado"
- [ ] Limpar cookies
- [ ] Testar em abas privada/incógnito
- [ ] Verificar se não tem software suspeito rodando

### ❌ "Ferramentas legítimas estão bloqueadas"
- [ ] Adicionar User-Agent à whitelist em `js/script.js`
- [ ] Usando Nginx? Adicionar exceção em `nginx.conf.example`

---

## 📞 Suporte

Para dúvidas sobre as proteções implementadas, consulte:
1. `SEGURANCA_ANTI_SCRAPING.md` - Lista completa de proteções
2. `js/script.js` - Código-fonte das proteções
3. `.htaccess` ou `nginx.conf.example` - Configurações de servidor

---

## ✨ Próximas Melhorias (Opcional)

- [ ] Rate limiting avançado (IP-based)
- [ ] CAPTCHA para suspicious behavior
- [ ] Geolocation blocking
- [ ] WAF integration
- [ ] Advanced logging dashboard

---

**Status**: ✅ SITE EXTREMAMENTE PROTEGIDO  
**Data**: Agosto 2024  
**Versão**: 1.0  
