# ==========================================
# STAGE 1: Build React Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL
ARG VITE_WS_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL

RUN npm run build

# ==========================================
# STAGE 2: Serve using non-root Nginx
# ==========================================
FROM nginxinc/nginx-unprivileged:alpine AS runner

# Copy built React files
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy Custom Nginx configuration
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
