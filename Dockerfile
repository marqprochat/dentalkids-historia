# Estágio 1: Build do Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
# Usar npm ci para instalação mais rápida e confiável (consome menos memória que install)
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# Estágio 2: Build do Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
# Copiar pasta prisma antes do install para o postinstall do @prisma/client funcionar
COPY backend/prisma ./prisma/
# Usar npm ci aqui também
RUN npm ci --no-audit --no-fund
COPY backend .
# Gerar o cliente Prisma novamente para garantir
RUN npx prisma generate
RUN npm run build

# Estágio 3: Runtime de Produção
FROM node:20-alpine
WORKDIR /app

# Instalar dependências de produção apenas (opcional, mas bom para reduzir tamanho)
# Aqui estamos copiando do builder para garantir que temos tudo, incluindo binários compilados
COPY --from=backend-builder /app/backend/package*.json ./
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/prisma ./prisma

# Copiar o build do frontend para uma pasta pública no backend
COPY --from=frontend-builder /app/dist ./public

# Criar diretório de uploads
RUN mkdir -p uploads

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/server.js"]
