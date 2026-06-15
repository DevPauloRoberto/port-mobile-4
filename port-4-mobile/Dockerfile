# ── Stage 1: Build Angular ────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -- --configuration=production

# ── Stage 2: Serve com nginx ──────────────────────────────────────────────────
FROM nginx:alpine
COPY --from=builder /app/dist/port-4-mobile/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
