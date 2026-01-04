# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files trước để cache
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

# Build Vite app
RUN npm run build


# ---------- Stage 2: Run ----------
FROM nginx:alpine

# delete default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy build output to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config 
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
