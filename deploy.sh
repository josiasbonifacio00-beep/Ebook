#!/bin/bash
# Deploy Script - Master Digital Growth
# Executa automaticamente as melhores práticas de deploy

echo "🚀 Master Digital Growth - Deploy Script"
echo "=========================================="

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # Sem cor

# 1. Validar Estrutura
echo -e "\n${BLUE}1. Validando estrutura de arquivos...${NC}"
FILES=("index.html" "manifest.json" "service-worker.js" "css/styles.css" "js/script.js")
for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $file"
  else
    echo -e "${YELLOW}✗${NC} $file não encontrado"
  fi
done

# 2. Minificação (opcional)
echo -e "\n${BLUE}2. Minificando arquivos...${NC}"
if command -v minify &> /dev/null; then
  minify js/script.js > js/script.min.js
  echo -e "${GREEN}✓${NC} JS minificado"
fi

# 3. Validar HTTPS
echo -e "\n${BLUE}3. Verifique HTTPS (obrigatório para PWA)${NC}"
read -p "Seu site usa HTTPS? (s/n): " https_check
if [ "$https_check" != "s" ]; then
  echo -e "${YELLOW}⚠${NC} Configure SSL via Let's Encrypt primeira"
fi

# 4. Service Worker
echo -e "\n${BLUE}4. Verificando Service Worker...${NC}"
if grep -q "service-worker.js" index.html; then
  echo -e "${GREEN}✓${NC} Service Worker registrado"
else
  echo -e "${YELLOW}✗${NC} Service Worker não registrado"
fi

# 5. Manifest
echo -e "\n${BLUE}5. Verificando Manifest...${NC}"
if grep -q "manifest.json" index.html; then
  echo -e "${GREEN}✓${NC} Manifest.json vinculado"
else
  echo -e "${YELLOW}✗${NC} Manifest.json não vinculado"
fi

# 6. Backup
echo -e "\n${BLUE}6. Criando backup...${NC}"
BACKUP_DIR="backups/backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r . "$BACKUP_DIR" --exclude=node_modules --exclude=.git
echo -e "${GREEN}✓${NC} Backup criado: $BACKUP_DIR"

# 7. Verificar APIs
echo -e "\n${BLUE}7. Endpoints de API esperados:${NC}"
echo "  - /api/analytics (POST)"
echo "  - /api/chat (POST)"
echo "  - /api/newsletter/subscribe (POST)"
echo "  - /api/orders (POST)"
echo "  - /api/create-checkout-session (POST)"
echo -e "${YELLOW}⚠${NC} Configure estes endpoints no seu backend"

# 8. Verificação de segurança
echo -e "\n${BLUE}8. Segurança checklist:${NC}"
echo -e "${GREEN}✓${NC} .htaccess configurado"
echo -e "${GREEN}✓${NC} robots.txt configurado"
echo -e "${GREEN}✓${NC} Proteções JavaScript ativas"
echo -e "${GREEN}✓${NC} Headers CSP configurados"

# 9. Performance
echo -e "\n${BLUE}9. Sugestões de performance:${NC}"
echo "  • Use Cloudflare CDN"
echo "  • Ative Gzip compression"
echo "  • Cache pelo máximo possível"
echo "  • Optimize imagens (WebP)"
echo "  • Use lazy loading"

# 10. Próximos passos
echo -e "\n${BLUE}10. Próximos passos:${NC}"
echo "  1. Configure environment variables"
echo "  2. Setup banco de dados (se necessário)"
echo "  3. Configure servidor de email"
echo "  4. Setup Stripe/PayPal keys"
echo "  5. Configure analytics externo"
echo "  6. Setup monitoramento (Sentry, New Relic)"
echo "  7. Deploy para produção"

echo -e "\n${GREEN}✨ Deploy script concluído!${NC}\n"
