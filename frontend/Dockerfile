# frontend/Dockerfile
################### BUILD ###################
FROM node:22-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@latest-10

# Instala deps con lockfile para caché 🧊
COPY package*.json pnpm-lock.yaml ./
RUN pnpm install

# Copia el resto y construye
COPY . .
ARG VITE_API_URL=http://localhost:4000
RUN pnpm run build

################### RUNTIME #################
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Copia artefactos
COPY --from=builder /app/dist . 
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
