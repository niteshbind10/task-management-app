# ==========================================
# STAGE 1: Build TypeScript Code
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json tsconfig.json nodemon.json ./

RUN npm ci

COPY src/ ./src/

RUN npm run build

# ==========================================
# STAGE 2: Run Production Build (Non-root user)
# ==========================================
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /usr/src/app/build ./build

# Create logs folder and set permissions
RUN mkdir logs && chown -R node:node /usr/src/app

# Run as non-root node user (Security Requirement)
USER node

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "build/index.js"]
