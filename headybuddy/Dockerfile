# ╔═══════════════════════════════════════════════════════════════╗
# ║  HEADY SYSTEMS — HeadyBuddy Widget Dockerfile                ║
# ║  Multi-stage build: npm install + vite build → nginx serve    ║
# ╚═══════════════════════════════════════════════════════════════╝

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 3400;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://heady-manager:3300;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
EXPOSE 3400
CMD ["nginx", "-g", "daemon off;"]
